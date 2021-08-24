import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-2' });

const createMessage = async (_params: DynamoDB.DocumentClient.PutItemInput) => {
  try {
    await documentClient.put(_params).promise()
  } catch (error) {
    throw error;
  }
};

interface Message { 
  name:string,
  email: string, 
  subject: string, 
  message: string
 }


export const hello: Handler = async (event: any, context: Context, callback: Callback) => {
  try {

    let form = event.body as Message;

    let params: DynamoDB.DocumentClient.PutItemInput = {
      Item: {
        id: '1',
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      },
      TableName: 'message'
    }
    console.log(form);
    //await createMessage(params);

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello World, desde AWS utilizando serverless'
      }),
    };

    return callback(null, response);

  } catch (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Ha ocurrido un error ${error}`
      }),
    };

    return callback(null, response);

  }


};