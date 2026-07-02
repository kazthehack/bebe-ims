# Deploy Guide (AWS + DynamoDB + CDK)

This repository now includes an AWS CDK infrastructure scaffold under:

- `infra/cdk`

It deploys:

- `DynamoDB` table (`pk/sk` + `gsi1`)
- `ECS Fargate` backend service (from `backend/Dockerfile`)
- `Application Load Balancer` for backend traffic
- `S3 + CloudFront` for frontend hosting
- CloudFront route `/api/*` to backend ALB

## CDK in plain terms

Yes: CDK is effectively CloudFormation made developer-friendly.

- You define infrastructure in code (TypeScript/Python/etc).
- CDK synthesizes that into CloudFormation templates.
- AWS deploys it with the same CloudFormation engine.

So it is not replacing CloudFormation. It is a higher-level way to generate and manage it.

## Why this setup is low resistance

- Backend is containerized and deployed directly from this repo.
- Frontend is static hosting (simple, cheap, robust).
- DynamoDB stays managed by AWS (no DB container to run).
- Infra is versioned in code (`infra/cdk`) and reproducible.

## Fast path: config + one script

You can now deploy with a single script after filling one config file.

1. Copy config template:
```bash
cd /Users/irvinbernardo/Desktop/bebe-inventory/infra/cdk
cp deploy.env.example deploy.env
```

2. Edit `deploy.env` and set at least:
- `AWS_ACCOUNT_ID`
- `AWS_REGION`
- either `AWS_PROFILE` or `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY`

3. Run deployment:
```bash
cd /Users/irvinbernardo/Desktop/bebe-inventory/infra/cdk
python3 deploy.py
```

What `deploy.py` does:
- validates AWS credentials
- builds frontend with `REACT_APP_REST_API_ENDPOINT=/api/v1`
- runs `cdk bootstrap` (optional via config)
- deploys stack with your context values
- validates the deployed backend through the stack `AlbApiUrl`/`ApiBaseUrl` health endpoint
- prints stack outputs
- runs safe `scripts/migrate.py` against AWS DynamoDB (optional via config)
- automatically rolls back the deployment path on failure when `AUTO_ROLLBACK_ON_FAILURE=true`

## GitHub Actions production deploy

Production deploys are wired to the `prod` branch:

```bash
git push origin prod
```

The workflow runs:
- `make`
- `make deploy`

It also supports manual runs from the GitHub Actions `Deploy Production` workflow.

Required GitHub repository secrets:
- `AWS_ACCOUNT_ID`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

Optional GitHub repository variables:
- `AWS_REGION` defaults to `ap-southeast-1`
- `PROJECT_NAME` defaults to `bebe-ims`
- `TABLE_NAME` defaults to `bebe_ims`
- `BACKEND_CPU` defaults to `256`
- `BACKEND_MEMORY_MIB` defaults to `512`
- `BACKEND_DESIRED_COUNT` defaults to `1`
- `HEALTHCHECK_TIMEOUT_SECONDS` defaults to `300`

## Prerequisites

1. AWS account and an IAM user/role with permissions for:
- CloudFormation
- ECS/Fargate
- ECR (for CDK Docker assets)
- ELB
- VPC
- S3
- CloudFront
- DynamoDB
- IAM

2. Local tools:
- Node.js 18+
- Docker
- AWS CLI (`aws configure`)

3. CDK bootstrap once per account+region:
```bash
cd infra/cdk
npm install
npx cdk bootstrap aws://<AWS_ACCOUNT_ID>/<AWS_REGION>
```

## Manual deployment (if you want each step)

1. Build frontend with same-origin API path:
```bash
cd /Users/irvinbernardo/Desktop/bebe-inventory/app
REACT_APP_REST_API_ENDPOINT=/api/v1 NODE_PATH=src yarn build
```

2. Deploy infrastructure + backend + frontend:
```bash
cd /Users/irvinbernardo/Desktop/bebe-inventory/infra/cdk
export CDK_DEFAULT_ACCOUNT=<AWS_ACCOUNT_ID>
export CDK_DEFAULT_REGION=<AWS_REGION>
npx cdk deploy
```

3. Read stack outputs:
- `FrontendUrl`
- `ApiBaseUrl`
- `AlbApiUrl`
- `DynamoTableName`

## Audit and rollback

Before or after an attempted deployment, inspect the live AWS stack/ECS state:

```bash
make deploy-audit
```

If a deployment fails or needs to be taken down for the next iteration:

```bash
make deploy-rollback
```

Rollback behavior:
- cancels in-progress CloudFormation updates when possible
- deletes failed/in-progress first-time stack creates
- restores the previous ECS task definition when `deploy.py` captured one before an update
- otherwise scales the ECS service to `0` and stops running tasks

The normal deploy path runs this rollback automatically when `AUTO_ROLLBACK_ON_FAILURE=true`.

## Run migration safely in AWS

`make migrate` is intended to ensure structure/defaults without inventory overwrite.

For AWS environment, run migration from your machine against AWS DynamoDB:

```bash
cd /Users/irvinbernardo/Desktop/bebe-inventory/backend
source .venv/bin/activate
BEBE_IMS_APP_ENV=production \
BEBE_IMS_AWS_REGION=<AWS_REGION> \
BEBE_IMS_DYNAMODB_TABLE_NAME=<DynamoTableName output> \
BEBE_IMS_DYNAMODB_ENDPOINT_URL=https://dynamodb.<AWS_REGION>.amazonaws.com \
PYTHONPATH=. python scripts/migrate.py
```

Notes:
- This uses AWS-managed DynamoDB endpoint.
- Do not run `migrate-init` unless you explicitly want inventory catalog sync.
- Do not run `reset` unless you explicitly intend to zero stock quantities.

## Stateful resource handling

DynamoDB is treated as critical state.

If `TABLE_NAME` already exists outside the CDK stack, `deploy.py` defaults to adopting it with:

```bash
ADOPT_EXISTING_DYNAMODB_TABLE=true
```

In this mode CDK imports the existing table by name and grants the backend access to it instead of attempting to create a duplicate table. Before deploy continues, the script verifies the existing table has:
- primary key `pk/sk`
- global secondary index `gsi1` using `gsi1pk/gsi1sk`

Use `USE_EXISTING_DYNAMODB_TABLE=true` only when you want to force import behavior. Use `USE_EXISTING_DYNAMODB_TABLE=false` only when you intentionally want CDK to create/manage the table and you are certain no table with that name already exists.

## Frontend S3 deploy behavior

Frontend assets are deployed through CDK `BucketDeployment`, which uses a Lambda-backed CloudFormation custom resource.

The deployment is tuned for larger frontend bundles and retry safety:
- CDK's generated BucketDeployment Lambda timeout is 15 minutes in the installed CDK version.
- `memoryLimit=1024` improves Lambda CPU/network throughput.
- `ephemeralStorageSize=1024 MiB` gives the deployment Lambda more temp space.
- `waitForDistributionInvalidation=false` avoids waiting for CloudFront edge propagation inside CloudFormation.
- `prune=false` keeps old static files during retries instead of deleting files that are not present in the current build.
- `retainOnDelete=true` avoids deleting uploaded frontend files during stack delete/recovery.

CloudFront invalidation is still requested by the custom resource, but the stack does not wait for the invalidation to finish.

## Files added for CDK

- `infra/cdk/package.json`
- `infra/cdk/tsconfig.json`
- `infra/cdk/cdk.json`
- `infra/cdk/bin/bebe-ims.ts`
- `infra/cdk/lib/bebe-ims-stack.ts`
- `infra/cdk/deploy.env.example`
- `infra/cdk/deploy.py`

## Optional context overrides

You can override defaults at deploy time:

```bash
npx cdk deploy \
  -c projectName=bebe-ims \
  -c environmentName=prod \
  -c apiPrefix=/api/v1 \
  -c tableName=bebe_ims \
  -c backendCpu=256 \
  -c backendMemoryMiB=512 \
  -c backendDesiredCount=1
```

## Deployment behavior flags

Configure these in `infra/cdk/deploy.env`:

- `AUTO_BOOTSTRAP=true`: run CDK bootstrap before deploy.
- `RUN_MIGRATE=true`: run backend migration after the deployed API passes health check.
- `ADOPT_EXISTING_DYNAMODB_TABLE=true`: automatically import an existing stateful DynamoDB table instead of trying to create a duplicate.
- `POST_DEPLOY_HEALTHCHECK=true`: wait for `/health` on the deployed API before migration.
- `HEALTHCHECK_TIMEOUT_SECONDS=300`: maximum wait time for the health check.
- `AUTO_ROLLBACK_ON_FAILURE=true`: attempt rollback/cleanup when an AWS-stage failure occurs.

## Cost and operations notes

- Current VPC config uses public subnets and no NAT Gateway (lower cost, simpler).
- ALB is public.
- Backend Fargate defaults to `256 CPU / 512 MiB`, the smallest Fargate size, to reduce always-on compute cost.
- Backend CloudWatch logs are retained for 7 days to avoid unbounded log storage growth.
- DynamoDB uses on-demand billing and PITR enabled.
- S3/CloudFront resources are retained on stack delete by default safeguards.
- The frontend S3 bucket expires noncurrent object versions after 30 days and aborts incomplete multipart uploads after 7 days.
