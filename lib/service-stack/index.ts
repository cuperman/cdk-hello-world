import { App, Stack, StackProps } from '@aws-cdk/cdk';
import { Runtime } from '@aws-cdk/aws-lambda';
import { cloudformation } from '@aws-cdk/aws-serverless';
import { Parameter } from '@aws-cdk/cdk';
import { ZipDirectoryAsset } from '@aws-cdk/assets';

export class ServiceStack extends Stack {
  public serviceBucket: Parameter;
  public serviceObjectKey: Parameter;
  public serviceAsset: ZipDirectoryAsset;
  public helloWorldFunction: cloudformation.FunctionResource;

  constructor(parent: App, name: string, props?: StackProps) {
    super(parent, name, props);

    const pipeline = this.getContext('pipeline');

    this.serviceBucket = new Parameter(this, 'ServiceBucket', {
      type: 'String',
      default: ''
    });

    this.serviceObjectKey = new Parameter(this, 'ServiceObjectKey', {
      type: 'String',
      default: ''
    });

    if (!pipeline) {
      this.serviceAsset = new ZipDirectoryAsset(this, 'ServiceAsset', {
        path: 'lib/service-asset'
      });
    }

    this.helloWorldFunction = new cloudformation.FunctionResource(this, 'HelloWorldFunction', {
      runtime: Runtime.NodeJS810.name,
      codeUri: {
        bucket: this.serviceAsset ? this.serviceAsset.s3BucketName : this.serviceBucket.value,
        key: this.serviceAsset ? this.serviceAsset.s3ObjectKey : this.serviceObjectKey.value
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
