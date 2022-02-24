const AWS = require("aws-sdk");
AWS.config.update({
  region: "eu-west-2",
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = "invoice-inventory";
const healthPath = "/health";
const invoicePath = "/invoice";
const invoicesPath = "/invoices";

exports.handler = async function (event) {
  console.log(`Request event: ${event}`);
  let response;
  switch (true) {
    case event.httpMethod === "GET" && event.path === healthPath:
      response = buildResponse(200);
      break;
    case event.httpMethod === "GET" && event.path === invoicePath:
      response = await getinvoice(event.queryStringParameters.id);
      break;
    case event.httpMethod === "GET" && event.path === invoicesPath:
      response = await getinvoices();
      break;
    case event.httpMethod === "POST" && event.path === invoicePath:
      response = await createinvoice(JSON.parse(event.body));
      break;
    case event.httpMethod === "PATCH" && event.path === invoicePath:
      const requestBody = JSON.parse(event.body);
      response = await updateinvoice(
        requestBody.id,
        requestBody.updateKey,
        requestBody.updateValue
      );
      break;
    case event.httpMethod === "DELETE" && event.path === invoicePath:
      response = await deleteinvoice(JSON.parse(event.body).id);
      break;
    default:
      response = buildResponse(404, "404 Not Found");
  }
  return response;
};

//get single invoice
async function getinvoice(id) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id,
    },
  };
  return await dynamodb
    .get(params)
    .promise()
    .then(
      (response) => {
        return buildResponse(200, response.Item);
      },
      (error) => {
        console.error("Something went wrong..Oops😥: ", error);
      }
    );
}

//get invoices
async function getinvoices() {
  const params = {
    TableName: dynamodbTableName,
  };
  const allinvoices = await scanDynamoRecords(params, []);
  const body = {
    invoices: allinvoices,
  };
  return buildResponse(200, body);
}

//Search Database
async function scanDynamoRecords(scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
    itemArray = itemArray.concat(dynamoData.Items);
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch (error) {
    console.error("Something went wrong..Oops😥: ", error);
  }
}
//create invoice
async function createinvoice(requestBody) {
  const params = {
    TableName: dynamodbTableName,
    Item: requestBody,
  };
  return await dynamodb
    .put(params)
    .promise()
    .then(
      () => {
        const body = {
          Operation: "SAVE",
          Message: "SUCCESS CREATING invoiceS",
          Item: requestBody,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong..Oops😥: ", error);
      }
    );
}

//modify invoice
async function updateinvoice(id, updateKey, updateValue) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id,
    },
    UpdateExpression: `set ${updateKey} = :value`,
    ExpressionAttributeValues: {
      ":value": updateValue,
    },
    ReturnValues: "UPDATED_NEW",
  };
  return await dynamodb
    .update(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Operation: "UPDATE",
          Message: "SUCCESS UPDATING invoiceS",
          UpdatedAttributes: response,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong..Oops😥: ", error);
      }
    );
}

//delete invoice
async function deleteinvoice(id) {
  const params = {
    TableName: dynamodbTableName,
    Key: {
      id: id,
    },
    ReturnValues: "ALL_OLD",
  };
  return await dynamodb
    .delete(params)
    .promise()
    .then(
      (response) => {
        const body = {
          Operation: "DELETE",
          Message: "SUCCESS DELETING invoiceS",
          Item: response,
        };
        return buildResponse(200, body);
      },
      (error) => {
        console.error("Something went wrong..Oops😥: ", error);
      }
    );
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}
