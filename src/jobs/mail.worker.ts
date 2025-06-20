import { Worker } from "bullmq";
import { connection } from "../config/redis";
import { sendEmail } from "../services/mail.service";

console.log("👷‍♂️ [Worker] Iniciando mailWorker...");

export const mailWorker = new Worker(
  "mailQueue",
  async (job) => {
    console.log(`📩 [Worker] Processando job ${job.id}...`);
    const { to, subject, templatePath, variables } = job.data;

    try {
      await sendEmail({ to, subject, templatePath, variables });
      console.log(`✅ [Worker] E-mail enviado com sucesso para ${to}`);
    } catch (error) {
      console.error(`❌ [Worker] Falha ao enviar e-mail para ${to}:`, error);
      throw error; // permite que o job seja reprocessado automaticamente
    }
  },
  {
    connection,
  }
);

mailWorker.on("completed", (job) => {
  console.log(`🎉 [Worker] Job ${job.id} finalizado com sucesso.`);
});

mailWorker.on("failed", (job, err) => {
  console.error(`🔥 [Worker] Job ${job?.id} falhou: ${err.message}`);
});
