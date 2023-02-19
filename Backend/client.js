import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import logger from "./logger.js";

const packageDefinition = loadSync("protos/worker.proto", {});
const grpcObject = loadPackageDefinition(packageDefinition);
const { servicePackage } = grpcObject;

const client = new servicePackage.WorkerService(
  "localhost:50051",
  credentials.createInsecure()
);

function createRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

setInterval(() => {
  const request = { data: createRandomString(10) };
  client.sendRequest(request, (error, response) => {
    if (error) {
      logger.error(error);
      return;
    }
    logger.info(`Response received from server: ${JSON.stringify(response)}`);
  });
}, 1000);
