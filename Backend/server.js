import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import amqp from "amqplib";
import logger from "./logger.js";

const packageDefinition = protoLoader.loadSync("protos/worker.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const { servicePackage } = grpcObject;

async function sendRequestToQueue(request) {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queueName = "jobs";
  const message = JSON.stringify(request);

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });

  logger.info(`Request sent to queue: ${message}`);
}

function sendRequest(call, callback) {
  const request = call.request;
  try {
    sendRequestToQueue(request);
  } catch (error) {
    logger.error(error);
    callback(error, null);
    return;
  }
  callback(null, { success: true });
}

function main() {
  const server = new grpc.Server();
  server.addService(servicePackage.WorkerService.service, { sendRequest });
  server.bindAsync(
    "localhost:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error(error);
        return;
      }
      logger.info(
        `Registered function(s): ${Object.keys(
          servicePackage.WorkerService.service
        ).join(", ")}`
      );
      server.start();
      logger.info(`Server started on port ${port}`);
    }
  );
}
main();
