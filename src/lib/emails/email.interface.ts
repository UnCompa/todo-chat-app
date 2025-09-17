export interface EmailAdapter {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}