import axios from "axios";

export interface EmailData {
  to: string;
  subject: string;
  template: string;
  variables?: Record<string, any>;
}

export class QueueService {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3002") {
    this.baseUrl = baseUrl;
  }

  async addEmailToQueue(emailData: EmailData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/queue/email`,
        emailData
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar e-mail à fila:", error);
      throw error;
    }
  }

  async getQueueStats(queueName: string = "email") {
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/queue/stats/${queueName}`
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao obter estatísticas da fila:", error);
      throw error;
    }
  }
}
