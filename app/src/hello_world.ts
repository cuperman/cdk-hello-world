import { APIGatewayProxyEvent } from "aws-lambda";

exports.handler = async (event: APIGatewayProxyEvent) => {
  const queryParams = event.queryStringParameters;

  const name = (queryParams && queryParams.name) || "World";

  return `Hello, ${name}`;
};
