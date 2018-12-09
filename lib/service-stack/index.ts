import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { Runtime } from '@aws-cdk/aws-lambda';
import { cloudformation } from '@aws-cdk/aws-serverless';
import { Parameter } from '@aws-cdk/cdk';
import { ZipDirectoryAsset } from '@aws-cdk/assets';

const { FunctionResource } = cloudformation;

export class ServiceStack extends Stack {
  constructor(parent: App, name: string, props?: StackProps) {
    super(parent, name, props);

    const pipeline = this.getContext('pipeline');

    const serviceBucket = new Parameter(this, 'ServiceBucket', {
      type: 'String',
      default: ''
    });

    const serviceObjectKey = new Parameter(this, 'ServiceObjectKey', {
      type: 'String',
      default: ''
    });

    let serviceAsset;
    if (!pipeline) {
      serviceAsset = new ZipDirectoryAsset(this, 'ServiceAsset', {
        path: 'lib/service-asset'
      });
    }

    new FunctionResource(this, 'HelloWorldFunction', {
      runtime: Runtime.NodeJS810.name,
      codeUri: {
        bucket: serviceAsset ? serviceAsset.s3BucketName : serviceBucket.value,
        key: serviceAsset ? serviceAsset.s3ObjectKey : serviceObjectKey.value
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
