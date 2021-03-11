const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
const queueUrl = process.env.QUEUE_URL;

exports.handler = (event, context, callback) => {
  sqs.receiveMessage(
    {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ["All"],
      QueueUrl: queueUrl,
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0,
    },
    (err, data) => {
      if (err) {
        console.log(`Receive error: ${err}`);
        callback(err, "Error fetching messages from SQS");
      } else if (data.Messages) {
        console.log(`Number of messages received: ${data.Messages.length}`);
        console.log(`Recived message: ${JSON.stringify(data.Messages[0])}`);
        console.log(`Message body: ${data.Messages[0].Body}`);
        sqs.deleteMessage(
          { QueueUrl: queueUrl, ReceiptHandle: data.Messages[0].ReceiptHandle },
          (err, data) => {
            if (err) {
              console.log(`Delete error: ${err}`);
            } else {
              console.log(`Message deleted: ${JSON.stringify(data)}`);
            }
          }
        );
      } else {
        console.log("No messages received");
      }
    }
  );
};
