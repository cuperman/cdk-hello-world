import cdk = require("@aws-cdk/cdk");
import s3 = require("@aws-cdk/aws-s3");
import lambda = require("@aws-cdk/aws-lambda");

export class HelloWorldCdkStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    new s3.Bucket(this, "MyFirstBucket", {
      versioned: true
    });

    new lambda.Function(this, "HelloWorldFunction", {
      runtime: lambda.Runtime.NodeJS810,
      code: lambda.Code.asset("./app"),
      handler: "src/hello_world.handler"
    });
  }
}
