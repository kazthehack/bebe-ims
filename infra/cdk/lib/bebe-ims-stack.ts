import * as path from "path";
import * as cdk from "aws-cdk-lib";
import {
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_dynamodb as dynamodb,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecs_patterns as ecsPatterns,
  aws_s3 as s3,
  aws_s3_deployment as s3deploy,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class BebeImsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectName = String(this.node.tryGetContext("projectName") ?? "bebe-ims");
    const environmentName = String(this.node.tryGetContext("environmentName") ?? "prod");
    const apiPrefix = String(this.node.tryGetContext("apiPrefix") ?? "/api/v1");
    const tableName = String(this.node.tryGetContext("tableName") ?? "bebe_ims");
    const backendCpu = Number(this.node.tryGetContext("backendCpu") ?? 512);
    const backendMemoryMiB = Number(this.node.tryGetContext("backendMemoryMiB") ?? 1024);
    const backendDesiredCount = Number(this.node.tryGetContext("backendDesiredCount") ?? 1);

    const dynamoTable = new dynamodb.Table(this, "BebeImsTable", {
      tableName,
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    dynamoTable.addGlobalSecondaryIndex({
      indexName: "gsi1",
      partitionKey: { name: "gsi1pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "gsi1sk", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    const vpc = new ec2.Vpc(this, "BebeImsVpc", {
      maxAzs: 2,
      natGateways: 0,
    });

    const cluster = new ecs.Cluster(this, "BebeImsCluster", {
      clusterName: `${projectName}-${environmentName}-cluster`,
      vpc,
    });

    const backendImage = ecs.ContainerImage.fromAsset(
      path.resolve(__dirname, "../../../backend"),
      {
        file: "Dockerfile",
      },
    );

    const backendService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, "BebeImsApi", {
      cluster,
      publicLoadBalancer: true,
      assignPublicIp: true,
      taskSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      desiredCount: backendDesiredCount,
      cpu: backendCpu,
      memoryLimitMiB: backendMemoryMiB,
      listenerPort: 80,
      taskImageOptions: {
        image: backendImage,
        containerPort: 8001,
        environment: {
          BEBE_IMS_APP_ENV: "production",
          BEBE_IMS_API_PREFIX: apiPrefix,
          BEBE_IMS_AWS_REGION: cdk.Stack.of(this).region,
          BEBE_IMS_DYNAMODB_TABLE_NAME: dynamoTable.tableName,
          BEBE_IMS_DYNAMODB_ENDPOINT_URL: `https://dynamodb.${cdk.Stack.of(this).region}.amazonaws.com`,
          BEBE_IMS_CORS_ORIGINS: "",
          BEBE_IMS_CORS_ORIGIN_REGEX: "^https://.*$",
        },
      },
    });

    backendService.targetGroup.configureHealthCheck({
      path: `${apiPrefix}/health`,
      healthyHttpCodes: "200",
    });

    dynamoTable.grantReadWriteData(backendService.taskDefinition.taskRole);

    const frontendBucket = new s3.Bucket(this, "BebeImsFrontendBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    });

    const distribution = new cloudfront.Distribution(this, "BebeImsDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "api/*": {
          origin: new origins.LoadBalancerV2Origin(backendService.loadBalancer, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        },
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    const frontendBuildPath = path.resolve(__dirname, "../../../app/build");
    new s3deploy.BucketDeployment(this, "DeployFrontendBuild", {
      destinationBucket: frontendBucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [s3deploy.Source.asset(frontendBuildPath)],
    });

    new cdk.CfnOutput(this, "FrontendUrl", {
      value: `https://${distribution.domainName}`,
    });
    new cdk.CfnOutput(this, "ApiBaseUrl", {
      value: `https://${distribution.domainName}${apiPrefix}`,
    });
    new cdk.CfnOutput(this, "AlbApiUrl", {
      value: `http://${backendService.loadBalancer.loadBalancerDnsName}${apiPrefix}`,
    });
    new cdk.CfnOutput(this, "DynamoTableName", {
      value: dynamoTable.tableName,
    });
    new cdk.CfnOutput(this, "AwsRegion", {
      value: cdk.Stack.of(this).region,
    });
  }
}
