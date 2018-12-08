import { AuthResponseContext } from 'aws-lambda';

// tslint:disable-next-line:interface-name
export interface APIGatewayEventRequestContext {
  accountId: string;
  apiId: string;
  authorizer?: AuthResponseContext | null;
  httpMethod: string;
  identity: {
    accessKey: string | null;
    accountId: string | null;
    apiKey: string | null;
    apiKeyId: string | null;
    caller: string | null;
    cognitoAuthenticationProvider: string | null;
    cognitoAuthenticationType: string | null;
    cognitoIdentityId: string | null;
    cognitoIdentityPoolId: string | null;
    sourceIp: string;
    user: string | null;
    userAgent: string | null;
    userArn: string | null;
  };
  path: string;
  stage: string;
  requestId: string;
  requestTimeEpoch?: number;
  resourceId: string;
  resourcePath: string;
}

// tslint:disable-next-line:interface-name
export interface APIGatewayProxyEvent {
  body: string | null;
  headers: { [name: string]: string } | null;
  multiValueHeaders: { [name: string]: string[] } | null;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: { [name: string]: string } | null;
  queryStringParameters: { [name: string]: string } | null;
  multiValueQueryStringParameters: { [name: string]: string[] } | null;
  stageVariables: { [name: string]: string } | null;
  requestContext: APIGatewayEventRequestContext;
  resource: string;
}
