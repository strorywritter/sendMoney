const responses = require("../../response");
const AWS = require("aws-sdk");
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

exports.sendMoney = async (event) => {
  try {
    const userData = JSON.parse(event.body);

    const sendrParams = {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: "USER",
        SK: `USERID#${userData.senderAccNo}`,
      },
    };

    const senderData = await dynamoDbClient.get(sendrParams).promise();

    const recieverParams = {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: "USER",
        SK: `USERID#${userData.recieverAccNo}`,
      },
    };

    const recieverData = await dynamoDbClient.get(recieverParams).promise();
    
    // Check for whether sender is correct
    if (!senderData.Item) {
      return responses._400(`Sender's account Number does not exist`);
    }

    // check for whether reciever is correct
    if (!recieverData.Item) {
      return responses._400(`Reciever's account Number does not exist`);
    }
  
    // check for whether sender's name match
    if (senderData.Item.name != userData.senderName) {
      return responses._400(`Sender's name does not match`);
    }

    // check for whether reciever's accNo match
    if (recieverData.Item.accountNo != userData.recieverAccNo) {
      return responses._400(`Reciever's account Number does not match`);
    }

    // check for whether reciever's name match
    if (recieverData.Item.name != userData.recieverName) {
      return responses._400(`Reciever's name does not match`);
    }

    // check for balance
    if (senderData.Item.balance < userData.amount){
      return responses._400(`Insufficient balance`);
    }

    // calculate balance
    const senderBalance = Number(senderData.Item.balance) - Number(userData.amount)
    const recieverBalance = Number(recieverData.Item.balance) + Number(userData.amount)
    console.log(recieverData.Item.balance)
    console.log(userData.amount)

    const senderAccountUpdateParam = {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: "USER",
        SK: `USERID#${userData.senderAccNo}`,
      },
      UpdateExpression: "set #bal = :amount",
      ExpressionAttributeNames: {
        "#bal": "balance",
      },
      ExpressionAttributeValues: {
        ":amount": senderBalance,
      },
    };

    await dynamoDbClient.update(senderAccountUpdateParam).promise();

    const recieverAccountUpdateParam = {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: "USER",
        SK: `USERID#${userData.recieverAccNo}`,
      },
      UpdateExpression: "set #bal = :amount",
      ExpressionAttributeNames: {
        "#bal": "balance",
      },
      ExpressionAttributeValues: {
        ":amount": recieverBalance,
      },
    };

    await dynamoDbClient.update(recieverAccountUpdateParam).promise();

    return responses._200("Money has been sent successfully");
  } catch (error) {
    console.log(error);
    return responses._400(error);
  }
};