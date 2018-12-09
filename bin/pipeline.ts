#!/usr/bin/env node

import { App } from '@aws-cdk/cdk';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new App();
const appName = 'HelloWorld';
const appType = 'Pipeline';
const environment = 'development';
const stackName = `${appName}-${appType}-${environment}`;

new PipelineStack(app, stackName);

app.run();
