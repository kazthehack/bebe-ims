import * as path from "path";
import * as childProcess from "child_process";
import * as cdk from "aws-cdk-lib";
import * as fs from "fs";
import {
  aws_certificatemanager as acm,
  aws_apigateway as apigateway,
  aws_cloudfront as cloudfront,
  aws_cloudfront_origins as origins,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_route53 as route53,
  aws_route53_targets as targets,
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
    const useExistingDynamoTable = String(this.node.tryGetContext("useExistingDynamoTable") ?? "false")
      .toLowerCase() === "true";
    const backendMemoryMiB = Number(this.node.tryGetContext("backendMemoryMiB") ?? 512);
    const domainName = String(this.node.tryGetContext("domainName") ?? "")
      .trim()
      .replace(/\.$/, "")
      .toLowerCase();
    const hostedZoneDomainName = String(this.node.tryGetContext("hostedZoneDomainName") ?? domainName)
      .trim()
      .replace(/\.$/, "")
      .toLowerCase();

    let dynamoTable: dynamodb.ITable;
    if (useExistingDynamoTable) {
      dynamoTable = dynamodb.Table.fromTableName(this, "BebeImsTable", tableName);
    } else {
      const createdDynamoTable = new dynamodb.Table(this, "BebeImsTable", {
        tableName,
        partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
        sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        pointInTimeRecoverySpecification: {
          pointInTimeRecoveryEnabled: true,
        },
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      });

      createdDynamoTable.addGlobalSecondaryIndex({
        indexName: "gsi1",
        partitionKey: { name: "gsi1pk", type: dynamodb.AttributeType.STRING },
        sortKey: { name: "gsi1sk", type: dynamodb.AttributeType.STRING },
        projectionType: dynamodb.ProjectionType.ALL,
      });
      dynamoTable = createdDynamoTable;
    }

    const backendLogGroup = new logs.LogGroup(this, "BebeImsApiLogGroup", {
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const backendFunction = new lambda.Function(this, "BebeImsApiFunction", {
      functionName: `${projectName}-${environmentName}-api`,
      runtime: lambda.Runtime.PYTHON_3_12,
      architecture: lambda.Architecture.X86_64,
      handler: "lambda_handler.handler",
      memorySize: backendMemoryMiB,
      timeout: cdk.Duration.seconds(30),
      logGroup: backendLogGroup,
      code: lambda.Code.fromAsset(path.resolve(__dirname, "../../../backend"), {
        bundling: {
          image: lambda.Runtime.PYTHON_3_12.bundlingImage,
          local: {
            tryBundle(outputDir: string): boolean {
              const backendDir = path.resolve(__dirname, "../../../backend");
              const pipArgs = [
                "-m",
                "pip",
                "install",
                "--platform",
                "manylinux2014_x86_64",
                "--implementation",
                "cp",
                "--python-version",
                "3.12",
                "--only-binary=:all:",
                "--upgrade",
                "-r",
                "requirements.txt",
                "mangum",
                "-t",
                outputDir,
              ];

              try {
                childProcess.execFileSync("python3", pipArgs, {
                  cwd: backendDir,
                  stdio: "inherit",
                });
                fs.cpSync(path.join(backendDir, "app"), path.join(outputDir, "app"), {
                  recursive: true,
                });
                fs.writeFileSync(
                  path.join(outputDir, "lambda_handler.py"),
                  'from mangum import Mangum\nfrom app.main import app\nhandler = Mangum(app, lifespan="off")\n',
                  { encoding: "utf-8" },
                );
                return true;
              } catch {
                return false;
              }
            },
          },
          command: [
            "bash",
            "-c",
            [
              "pip install --no-cache-dir -r requirements.txt mangum -t /asset-output",
              "cp -R app /asset-output/app",
              "printf 'from mangum import Mangum\\nfrom app.main import app\\nhandler = Mangum(app, lifespan=\"off\")\\n' > /asset-output/lambda_handler.py",
            ].join(" && "),
          ],
        },
      }),
      environment: {
        BEBE_IMS_APP_ENV: "production",
        BEBE_IMS_API_PREFIX: apiPrefix,
        BEBE_IMS_AWS_REGION: cdk.Stack.of(this).region,
        BEBE_IMS_DYNAMODB_TABLE_NAME: dynamoTable.tableName,
        BEBE_IMS_DYNAMODB_ENDPOINT_URL: `https://dynamodb.${cdk.Stack.of(this).region}.amazonaws.com`,
        BEBE_IMS_CORS_ORIGINS: "",
        BEBE_IMS_CORS_ORIGIN_REGEX: "^https://.*$",
      },
    });

    dynamoTable.grantReadWriteData(backendFunction);

    const backendApi = new apigateway.LambdaRestApi(this, "BebeImsApi", {
      restApiName: `${projectName}-${environmentName}-api`,
      handler: backendFunction,
      proxy: true,
      deployOptions: {
        stageName: environmentName,
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.ERROR,
      },
      cloudWatchRole: true,
    });

    const frontendBucket = new s3.Bucket(this, "BebeImsFrontendBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      lifecycleRules: [
        {
          id: "ExpireOldFrontendVersions",
          noncurrentVersionExpiration: cdk.Duration.days(30),
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
        },
      ],
    });

    const backendOrigin = new origins.HttpOrigin(
      `${backendApi.restApiId}.execute-api.${cdk.Stack.of(this).region}.${cdk.Stack.of(this).urlSuffix}`,
      {
        originPath: `/${backendApi.deploymentStage.stageName}`,
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      },
    );

    const hostedZone = domainName
      ? route53.HostedZone.fromLookup(this, "BebeImsHostedZone", {
          domainName: hostedZoneDomainName,
        })
      : undefined;
    const certificate = domainName && hostedZone
      ? new acm.DnsValidatedCertificate(this, "BebeImsCertificate", {
          domainName,
          hostedZone,
          region: "us-east-1",
          subjectAlternativeNames: [`www.${domainName}`],
        })
      : undefined;

    const distribution = new cloudfront.Distribution(this, "BebeImsDistribution", {
      defaultRootObject: "index.html",
      certificate,
      domainNames: domainName ? [domainName, `www.${domainName}`] : undefined,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(frontendBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "api/*": {
          origin: backendOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        docs: {
          origin: backendOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        "openapi.json": {
          origin: backendOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        },
        redoc: {
          origin: backendOrigin,
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
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

    if (domainName && hostedZone) {
      const cloudFrontTarget = route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution));

      new route53.ARecord(this, "BebeImsApexAliasRecord", {
        zone: hostedZone,
        recordName: domainName,
        target: cloudFrontTarget,
      });
      new route53.AaaaRecord(this, "BebeImsApexIpv6AliasRecord", {
        zone: hostedZone,
        recordName: domainName,
        target: cloudFrontTarget,
      });
      new route53.ARecord(this, "BebeImsWwwAliasRecord", {
        zone: hostedZone,
        recordName: `www.${domainName}`,
        target: cloudFrontTarget,
      });
      new route53.AaaaRecord(this, "BebeImsWwwIpv6AliasRecord", {
        zone: hostedZone,
        recordName: `www.${domainName}`,
        target: cloudFrontTarget,
      });
    }

    const frontendBuildPath = path.resolve(__dirname, "../../../app/build");
    new s3deploy.BucketDeployment(this, "DeployFrontendBuild", {
      destinationBucket: frontendBucket,
      distribution,
      distributionPaths: ["/*"],
      sources: [s3deploy.Source.asset(frontendBuildPath)],
      memoryLimit: 1024,
      ephemeralStorageSize: cdk.Size.mebibytes(1024),
      prune: false,
      retainOnDelete: true,
      waitForDistributionInvalidation: false,
    });

    new cdk.CfnOutput(this, "FrontendUrl", {
      value: `https://${distribution.domainName}`,
    });
    new cdk.CfnOutput(this, "FrontendBucketName", {
      value: frontendBucket.bucketName,
    });
    new cdk.CfnOutput(this, "CloudFrontDistributionId", {
      value: distribution.distributionId,
    });
    new cdk.CfnOutput(this, "ApiBaseUrl", {
      value: `https://${distribution.domainName}${apiPrefix}`,
    });
    if (domainName) {
      new cdk.CfnOutput(this, "DomainUrl", {
        value: `https://${domainName}`,
      });
      new cdk.CfnOutput(this, "WwwDomainUrl", {
        value: `https://www.${domainName}`,
      });
    }
    new cdk.CfnOutput(this, "ApiGatewayUrl", {
      value: `${backendApi.url}${apiPrefix.replace(/^\//, "")}`,
    });
    new cdk.CfnOutput(this, "DynamoTableName", {
      value: dynamoTable.tableName,
    });
    new cdk.CfnOutput(this, "AwsRegion", {
      value: cdk.Stack.of(this).region,
    });
  }
}
