// email.service.ts

import { EmailAdapter } from "./email.interface.js";

export class EmailService {
  private adapter: EmailAdapter;

  constructor(adapter: EmailAdapter) {
    this.adapter = adapter;
  }

  async send(to: string, subject: string, body: string) {
    return this.adapter.sendEmail(to, subject, body);
  }
}