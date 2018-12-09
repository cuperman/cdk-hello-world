import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { Runtime } from '@aws-cdk/aws-lambda';
import { cloudformation } from '@aws-cdk/aws-serverless';
import { ZipDirectoryAsset } from '@aws-cdk/assets';

const { FunctionResource } = cloudformation;

export class AppStack extends Stack {
  constructor(parent: App, name: string, props?: StackProps) {
    super(parent, name, props);

    const appAsset = new ZipDirectoryAsset(this, 'AppAsset', {
      path: 'lib/service-asset'
    });

    new FunctionResource(this, 'HelloWorldFunction', {
      runtime: Runtime.NodeJS810.name,
      codeUri: {
        bucket: appAsset.s3BucketName,
        key: appAsset.s3ObjectKey
      },
      handler: 'index.handler',
      events: {
        MyMethod: {
          type: 'Api',
          properties: {
            path: '/',
            method: 'GET'
          }
        }
      }
    });
  }
}
