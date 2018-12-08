#!/usr/bin/env node

import { App } from '@aws-cdk/cdk';
import { AppStack } from '../lib/app-stack';

const app = new App();
const appName = 'HelloWorld';
const environment = 'development';
const stackName = `${appName}-${environment}`;

new AppStack(app, stackName);

app.run();
