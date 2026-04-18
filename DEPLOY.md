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
- prints stack outputs
- runs safe `scripts/migrate.py` against AWS DynamoDB (optional via config)

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
  -c backendCpu=512 \
  -c backendMemoryMiB=1024 \
  -c backendDesiredCount=1
```

## Cost and operations notes

- Current VPC config uses public subnets and no NAT Gateway (lower cost, simpler).
- ALB is public.
- DynamoDB uses on-demand billing and PITR enabled.
- S3/CloudFront resources are retained on stack delete by default safeguards.
