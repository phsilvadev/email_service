import path from "path";
import { transporter } from "../config/mailer";
import { readFile } from "fs/promises";

interface SendMailParams {
  to: string;
  subject: string;
  templatePath?: string;
  variables?: Record<string, string>;
}

export async function sendEmail({
  to,
  subject,
  templatePath,
  variables = {},
}: SendMailParams) {
  const filePath = path.resolve(
    __dirname,
    "..",
    "template",
    templatePath ?? "simple.html"
  );

  let template = await readFile(filePath, "utf-8");

  for (const [key, value] of Object.entries(variables)) {
    template = template.replace(new RegExp(`{{\\s*${key}\\s*}}`, "g"), value);
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html: template,
  });

  return info;
}
