#!/usr/bin/env node

import { App } from '@aws-cdk/cdk';
import { ServiceStack } from '../lib/service-stack';

const app = new App();
const appName = 'HelloWorld';
const appType = 'Service';
const environment = 'production';
const stackName = `${appName}-${appType}-${environment}`;

new ServiceStack(app, stackName);

app.run();
