interface EmailParams {
  to: string;
  subject: string;
  html_body?: string;
  text_body?: string;
  reply_to?: string;
  customer_id?: string;
}

interface EmailResult {
  success: boolean;
  message_id?: string;
  error?: string;
}

interface EmailService {
  send(params: EmailParams): Promise<EmailResult>;
}

interface Env {
  DB: D1Database;
  EMAILS: EmailService;
}
