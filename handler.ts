import { APIGatewayEvent } from "aws-lambda";

export const helloWorld = async (event: APIGatewayEvent) => ({
  statusCode: 200,
  body: JSON.stringify(
    {
      message: "First API Serverless function executed successfully!",
      queryString: event.queryStringParameters,
    },
    null,
    2
  ),
});

export const get = async (event: APIGatewayEvent) => ({
  statusCode: 200,
  body: JSON.stringify(
    {
      message: "GET Method",
      queryString: event,
    },
    null,
    2
  ),
});

export const post = async (event: APIGatewayEvent) => ({
  statusCode: 200,
  body: JSON.stringify(
    {
      message: "POST Method",
      body: JSON.parse(event.body)
    },
    null,
    2
  ),
});

export const put = async (event: APIGatewayEvent) => ({
  statusCode: 200,
  body: JSON.stringify(
    {
      message: "PUT Method",
      body: JSON.parse(event.body)
    },
    null,
    2
  ),
});

export const remove = async (event: APIGatewayEvent) => ({
  statusCode: 200,
  body: JSON.stringify(
    {
      message: "DELETE Method",
      body: JSON.parse(event.body)
    },
    null,
    2
  ),
});
