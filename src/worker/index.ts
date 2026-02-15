import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono<{ Bindings: Env }>();

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(1, "Message is required"),
});

// Email template helpers
const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 40px 20px; background-color: #f4f4f5; font-family: Arial, Helvetica, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px;">
    ${content}
  </div>
</body>
</html>
`;

const emailHeader = (title: string) => `
<div style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #e4e4e7;">
  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">${title}</h1>
</div>
`;

const emailBody = (content: string) => `
<div style="padding: 32px 40px;">
  ${content}
</div>
`;

const emailFooter = (text: string) => `
<div style="padding: 24px 40px; border-top: 1px solid #e4e4e7;">
  <p style="margin: 0; font-size: 12px; color: #71717a; text-align: center;">${text}</p>
</div>
`;

app.post("/api/contact", zValidator("json", contactSchema), async (c) => {
  const { name, email, message } = c.req.valid("json");

  try {
    const result = await c.env.EMAILS.send({
      to: "pabbavarsha01@gmail.com",
      subject: `Portfolio Contact: Message from ${name}`,
      html_body: emailTemplate(`
        ${emailHeader("New Contact Message")}
        ${emailBody(`
          <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;">
            <strong>From:</strong> ${name}
          </p>
          <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #3f3f46;">
            <strong>Email:</strong> ${email}
          </p>
          <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 24px; color: #3f3f46;">
            <strong>Message:</strong>
          </p>
          <p style="margin: 0; font-size: 16px; line-height: 24px; color: #3f3f46; padding: 16px; background-color: #f4f4f5; border-radius: 6px;">
            ${message}
          </p>
        `)}
        ${emailFooter("This message was sent from your portfolio contact form.")}
      `),
      text_body: `New contact message from ${name} (${email}):\n\n${message}`,
      reply_to: email,
    });

    if (result.success) {
      return c.json({ success: true, message: "Email sent successfully" });
    } else {
      console.error("Email send failed:", result.error);
      return c.json({ error: "Failed to send email" }, 500);
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return c.json({ error: "Failed to send email" }, 500);
  }
});

export default app;
