import logger from "../logger.js";
import { connect } from "amqplib";
import { Worker } from "worker_threads";
const AMQP_URL = process.env.AMQP_URL || "amqp://localhost";
const QUEUE_NAME = "storage";

const channel = await connect(AMQP_URL).then((conn) => conn.createChannel());
const worker = new Worker("./worker.js");
worker.on("message", (result) => {
  logger.info(
    `MANAGER: Result received from worker`
  );
});

worker.on("error", (error) => {
  logger.error(error);
});

channel.consume(QUEUE_NAME, (msg) => {
  if (msg !== null) {
    const message = msg.content.toString();
    logger.info(`MANAGER: Request received from queue`);
    worker.postMessage(message);
    channel.ack(msg);
  }
});
