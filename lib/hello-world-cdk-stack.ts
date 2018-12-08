import { App, Stack, StackProps } from "@aws-cdk/cdk";
import { Bucket } from "@aws-cdk/aws-s3";
import { Runtime } from "@aws-cdk/aws-lambda";
import { cloudformation } from "@aws-cdk/aws-serverless";
import { ZipDirectoryAsset } from "@aws-cdk/assets";

const { FunctionResource } = cloudformation;

export class HelloWorldCdkStack extends Stack {
  constructor(parent: App, name: string, props?: StackProps) {
    super(parent, name, props);

    new Bucket(this, "MyFirstBucket", {
      versioned: true
    });

    const appAsset = new ZipDirectoryAsset(this, "AppAsset", {
      path: "./app"
    });

    new FunctionResource(this, "HelloWorldFunction", {
      runtime: Runtime.NodeJS810.name,
      codeUri: {
        bucket: appAsset.s3BucketName,
        key: appAsset.s3ObjectKey
      },
      handler: "src/hello_world.handler",
      events: {
        MyMethod: {
          type: "Api",
          properties: {
            path: "/",
            method: "GET"
          }
        }
      }
    });
  }
}
