import { Router } from "express";
import { mailQueue } from "../jobs/mail.queue";

const router = Router();

router.post("/send", async (req, res) => {
  const { to, subject, templatePath, variables } = req.body;

  try {
    await mailQueue.add("sendMail", {
      to,
      subject,
      templatePath,
      variables,
    });

    res.status(202).json({ message: "Email enfileirado com sucesso!" });
  } catch (error) {
    console.error("Erro ao enfileirar e-mail:", error);
    res.status(500).json({ error: "Erro ao enfileirar e-mail" });
  }
});

export default router;
