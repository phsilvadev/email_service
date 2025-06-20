import { Queue } from "bullmq";
import { connection } from "../config/redis";

export const mailQueue = new Queue("mailQueue", { connection });
