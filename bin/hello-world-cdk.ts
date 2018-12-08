#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import { HelloWorldCdkStack } from '../lib/hello-world-cdk-stack';

const app = new cdk.App();
new HelloWorldCdkStack(app, 'HelloWorldCdkStack');
app.run();
