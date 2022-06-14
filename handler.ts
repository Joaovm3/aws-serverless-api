import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { response } from './response';
interface User {
  id: number,
  name: string,
  age: number,
}

const tableName = process.env.TABLE || 'Users';
const dynamo = new DynamoDB.DocumentClient({ 
  region: process.env.REGION || 'us-east-1',
});

const params = {
  TableName: tableName, 
};

export const helloWorld = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const data = {
    message: 'First API Serverless function with DynamoDB executed successfully!',
    queryString: event.queryStringParameters,
  };

  return response(200, data);
};

export const getAllUsers = async (): Promise<APIGatewayProxyResult> => {
  const users = await dynamo.scan(params).promise();
  const data = {
    message: 'List all Users',
    users: users.Items
  }
  return response(200, data);
};

export const getUser = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters?.id) {
    return response(400, { message: 'Bad Request' });
  } 
  
  const user = await dynamo
  .get({
    ...params,
    Key: {
      id: parseInt(event.pathParameters.id),
    },
  })
  .promise();

  console.log({ user })

  if (!user.Item) {
    return response(404, { message: 'User not found' });
  }

  return response(200, { user });
};

export const createUser = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { name, age } = JSON.parse(event.body || '{}');

  const id = Math.floor(1000 + Math.random() * 9000);
  const user = {
    id,
    name,
    age,
  }

  await dynamo.put({
    ...params,
    Item: user,
  }).promise();

  const data = {
    user,
    message: `User ${id} Created`,
  }

  return response(200, data);
};

export const updateUser = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { name, age } = JSON.parse(event.body || '{}');
  const id = Number(event.queryStringParameters?.id);

  const userExists = await dynamo
  .get({
    ...params,
    Key: {
      id: id,
    },
  })
  .promise();

  console.log({ userExists })

  if (!userExists.Item) {
    return response(404, { message: 'User not found' });
  }

  const user = {
    id,
    name,
    age
  }

  await dynamo.put({
    ...params,
    Item: user,
  }).promise();

  return response (200, { message: `User id ${id} updated` });
};

export const removeUser = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const id = Number(event.pathParameters?.id);

  await dynamo
  .delete({
    ...params,
    Key: {
      id: id,
    }
  })
  .promise();

  return response(204);
};
