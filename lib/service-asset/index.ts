import { APIGatewayProxyEvent } from '../aws-lambda/overrides';

export async function handler(event: APIGatewayProxyEvent) {
  const queryParams = event.queryStringParameters || {};

  const name = queryParams.name || 'World';

  return {
    statusCode: 200,
    body: JSON.stringify(`Hello, ${name}`)
  };
}
