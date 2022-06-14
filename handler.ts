import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { User } from './dto';
import { response } from './response';

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
    users: users.Items as User[]
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

  if (!user.Item) {
    return response(404, { message: 'User not found' });
  }

  return response(200, { user });
};

export const createUser = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { name, age } = JSON.parse(event.body || '{}');

  const user: User = {
    id: Math.floor(1000 + Math.random() * 9000),
    name,
    age,
  }

  await dynamo.put({
    ...params,
    Item: user,
  }).promise();

  const data = {
    user,
    message: `User ${user.id} Created`,
  }

  return response(200, data);
};

export const updateUser = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  if (!event.pathParameters?.id) {
    return response(400, { message: 'Bad Request' });
  } 

  const { name, age } = JSON.parse(event.body || '{}');
  const id = parseInt(event.pathParameters?.id);

  const userExists = await dynamo
  .get({
    ...params,
    Key: {
      id: id,
    },
  })
  .promise();

  if (!userExists.Item) {
    return response(404, { message: 'User not found' });
  }

  await dynamo.put({
    ...params,
    Item: {
      id,
      name,
      age
    },
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
