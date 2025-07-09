import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export interface SMTPConfig {
  name: string;
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Configurações de diferentes provedores SMTP
export const smtpConfigs: Record<string, SMTPConfig> = {
  hostinger: {
    name: "Hostinger",
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.HOSTINGER_USER || "",
      pass: process.env.HOSTINGER_PASS || "",
    },
  },
};

export class MailerService {
  private transporters: Map<string, nodemailer.Transporter> = new Map();
  private defaultProvider: string;

  constructor(defaultProvider: string = "hostinger") {
    this.defaultProvider = defaultProvider;
    this.initializeTransporters();
  }

  private initializeTransporters() {
    Object.entries(smtpConfigs).forEach(([provider, config]) => {
      if (this.isConfigValid(config)) {
        const transporter = nodemailer.createTransport(config);
        this.transporters.set(provider, transporter);
        console.log(`Transporter ${config.name} inicializado`);
      } else {
        console.warn(`Configuração inválida para ${config.name}, pulando...`);
      }
    });

    if (this.transporters.size === 0) {
      console.error("Nenhum transporter válido foi configurado!");
    }
  }

  private isConfigValid(config: SMTPConfig): boolean {
    return !!(config.auth.user && config.auth.pass);
  }

  getTransporter(provider?: string): nodemailer.Transporter | null {
    const selectedProvider = provider || this.defaultProvider;
    const transporter = this.transporters.get(selectedProvider);

    if (!transporter) {
      console.warn(
        `Transporter ${selectedProvider} não encontrado, tentando usar o padrão`
      );
      return this.transporters.get(this.defaultProvider) || null;
    }

    return transporter;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.transporters.keys());
  }

  async verifyConnection(provider?: string): Promise<boolean> {
    const transporter = this.getTransporter(provider);
    if (!transporter) {
      return false;
    }

    try {
      await transporter.verify();
      return true;
    } catch (error) {
      console.error(`Erro na verificação do transporter ${provider}:`, error);
      return false;
    }
  }
}
