import { APIGatewayProxyEvent } from '../lib/aws-lambda/overrides';

export = {
  resource: '/',
  path: '/',
  httpMethod: 'GET',
  headers: null,
  multiValueHeaders: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    path: '/',
    accountId: '588611805875',
    resourceId: 's8gmdqskh5',
    stage: 'test-invoke-stage',
    domainPrefix: 'testPrefix',
    requestId: '9c12a4ea-fb21-11e8-aeab-e155982b1aad',
    identity: {
      cognitoIdentityPoolId: null,
      cognitoIdentityId: null,
      apiKey: 'test-invoke-api-key',
      cognitoAuthenticationType: null,
      userArn: 'arn:aws:iam::588611805875:user/jeff',
      apiKeyId: 'test-invoke-api-key-id',
      userAgent:
        'aws-internal/3 aws-sdk-java/1.11.452 Linux/4.9.124-0.1.ac.198.71.329.metal1.x86_64 OpenJDK_64-Bit_Server_VM/25.192-b12 java/1.8.0_192',
      accountId: '588611805875',
      caller: 'AIDAJMKTBY2N6CSQQAHRW',
      sourceIp: 'test-invoke-source-ip',
      accessKey: 'ASIAYSC77MKZVYWX5LKF',
      cognitoAuthenticationProvider: null,
      user: 'AIDAJMKTBY2N6CSQQAHRW'
    },
    domainName: 'testPrefix.testDomainName',
    resourcePath: '/',
    httpMethod: 'GET',
    extendedRequestId: 'RmnIFFleoAMF6Ig=',
    apiId: '2lre2tq45a'
  },
  body: null,
  isBase64Encoded: false
} as APIGatewayProxyEvent;
