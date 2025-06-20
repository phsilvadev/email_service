import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null, // ⬅️ ESSENCIAL PARA O BULLMQ
});
