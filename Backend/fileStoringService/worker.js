import logger from "../logger.js";
import { parentPort, workerData } from "worker_threads";
import fs from "fs";
import path from "path";

parentPort.on("message", (result) => {
  logger.info(`WORKER: Result received from parent_thread`);
  parentPort.postMessage({
    result: processMessage(result),
  });
});

function processMessage(message) {
  message = JSON.parse(message);
  console.log(message.name);
  logger.info(`WORKER: Processing message`);

  let base64Image = message.data.split(";base64,").pop();
  try {
    fs.writeFileSync(`../../images/${message.name}`, base64Image, {
      encoding: "base64",
    });
  } catch (error) {
    logger.error(error);
  }
  logger.info(`WORKER: Image saved to ${message.name}`);
  return `Image saved to ${message.name}`;
}
