#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { BebeImsStack } from "../lib/bebe-ims-stack";

const app = new cdk.App();

const projectName = app.node.tryGetContext("projectName") ?? "bebe-ims";
const environmentName = app.node.tryGetContext("environmentName") ?? "prod";

new BebeImsStack(app, `${projectName}-${environmentName}`, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
