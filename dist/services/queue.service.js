"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const axios_1 = __importDefault(require("axios"));
class QueueService {
    constructor(baseUrl = "http://localhost:3002") {
        this.baseUrl = baseUrl;
    }
    async addEmailToQueue(emailData) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/api/queue/email`, emailData);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao adicionar e-mail à fila:", error);
            throw error;
        }
    }
    async getQueueStats(queueName = "email") {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/api/queue/stats/${queueName}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter estatísticas da fila:", error);
            throw error;
        }
    }
}
exports.QueueService = QueueService;
