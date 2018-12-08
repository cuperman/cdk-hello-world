import cdk = require("@aws-cdk/cdk");
import s3 = require("@aws-cdk/aws-s3");
import lambda = require("@aws-cdk/aws-lambda");
import serverless = require("@aws-cdk/aws-serverless");
import assets = require("@aws-cdk/assets");

export class HelloWorldCdkStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    new s3.Bucket(this, "MyFirstBucket", {
      versioned: true
    });

    const appAsset = new assets.ZipDirectoryAsset(this, "AppAsset", {
      path: "./app"
    });

    new serverless.cloudformation.FunctionResource(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NodeJS810.name,
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
