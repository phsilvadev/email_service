import path from "path";
import { MailerService } from "../config/mailer";
import fs from "fs";

export interface EmailData {
  to: string | string[];
  subject: string;
  template: string;
  variables?: Record<string, any>;
  from?: string;
  provider?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: string;
}

export class EmailService {
  private mailerService: MailerService;

  constructor() {
    this.mailerService = new MailerService();
  }
  async sendEmail(email: EmailData): Promise<EmailResult> {
    const { to, subject, template, variables = {}, from } = email;

    const templatePath = path.join(__dirname, `../template/${template}.html`);

    const htmlString = fs.readFileSync(templatePath, "utf-8");

    const renderHtmlTemplate = this.renderTemplate(htmlString, variables);

    console.log(renderHtmlTemplate);

    return {
      success: true,
      messageId: "info.messageId",
      provider: "hostinger",
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private renderTemplate(
    template: string,
    variables: Record<string, any>
  ): string {
    return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
      return variables[key] !== undefined ? variables[key] : "";
    });
  }
}
