import { Router } from "express";
import { QueueService } from "../services/queue.service";

const router = Router();
const queueService = new QueueService(process.env.BULLMQ_SERVICE_URL);

router.post("/send", async (req, res) => {
  const { to, subject, template, variables } = req.body;

  try {
    // Validação básica
    if (!to || !subject || !template) {
      return res.status(400).json({
        error: "Campos obrigatórios: to, subject, template",
      });
    }

    // Enviar para a fila via serviço BullMQ
    const result = await queueService.addEmailToQueue({
      to,
      subject,
      template,
      variables,
    });

    res.status(202).json({
      message: "Email enfileirado com sucesso!",
      jobId: result.jobId,
    });
  } catch (error) {
    console.error("Erro ao enfileirar e-mail:", error);
    res.status(500).json({ error: "Erro ao enfileirar e-mail" });
  }
});

router.get("/queue/stats", async (req, res) => {
  try {
    const stats = await queueService.getQueueStats();
    res.json(stats);
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({ error: "Erro ao obter estatísticas da fila" });
  }
});

export default router;
