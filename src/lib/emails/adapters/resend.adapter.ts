// adapters/resend.adapter.ts
import { Resend } from "resend";
import { EmailAdapter } from "../email.interface.js";

export class ResendAdapter implements EmailAdapter {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.info(`Enviando email a ${to}`)
    const data = await this.resend.emails.send({
      from: "App <noreply@saberium.site>",
      to,
      subject,
      html: body,
    });
    console.info(data)
  }
}