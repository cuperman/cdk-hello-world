#!/usr/bin/env node

import { App } from '@aws-cdk/cdk';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new App();
const appName = 'HelloWorld';
const appType = 'Pipeline';
const environment = 'production';
const repositoryName = 'hello-world-cdk';
const branchName = 'master';
const stackName = `${appName}-${appType}-${environment}`;

exports = new PipelineStack(app, stackName, {
  appName,
  environment,
  repositoryName,
  branchName
});

app.run();
