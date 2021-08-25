import { Handler, Context, Callback } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 }  from 'uuid';

const documentClient = new DynamoDB.DocumentClient({ region: 'us-east-2' });

const createMessage = async (_params: DynamoDB.DocumentClient.PutItemInput) => {
  try {
    await documentClient.put(_params).promise()
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const hello: Handler = async (event: any, context: Context, callback: Callback) => {
  try {

    let form = JSON.parse(event.body);
    let params: DynamoDB.DocumentClient.PutItemInput = {
      Item: {
        id: v4(),
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message
      },
      TableName: 'message'
    }
    console.log('Cuerpo', params.Item);
    await createMessage(params)
    .then(response => console.log(`Respuesta: ${response}`))
    .catch(error => console.log(`Errores devueltos ${error}`));

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