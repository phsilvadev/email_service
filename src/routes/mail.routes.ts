import { Router } from "express";
import { EmailData, QueueService } from "../services/queue.service";
import { EmailService } from "../services/email.service";

const router = Router();
const queueService = new QueueService(process.env.BULLMQ_SERVICE_URL);
const emailService = new EmailService();

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

router.post("/process", async (req, res) => {
  try {
    const { to, subject, template, variables } = req.body;

    if (!to || !subject || !template) {
      return res.status(400).json({
        error: "Campos obrigatórios: to, subject, template",
      });
    }
    const data = req.body as EmailData;
    await emailService.sendEmail(data);
    res.status(200).json({ mensage: "sucesso" });
  } catch (error) {
    console.error("Erro ao enfileirar e-mail:", error);
    res.status(500).json({ error: "Erro em enviar email e-mail" });
  }
});

export default router;
