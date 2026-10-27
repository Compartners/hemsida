import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1).max(1000),
  attachment: z
    .object({
      filename: z
        .string()
        .min(1)
        .max(200)
        .regex(/^[^/\\\r\n]+\.(pdf|doc|docx|xls|xlsx)$/i),
      content: z
        .string()
        .min(4)
        .max(4 * Math.ceil(MAX_FILE_SIZE / 3))
        .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/),
    })
    .optional(),
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metoden stöds inte." });
  }

  const result = contactSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Kontrollera formulärets uppgifter och bilagan.",
    });
  }

  const { name, email, phone, company, message, attachment } =
    result.data;

  if (
    attachment &&
    Buffer.from(attachment.content, "base64").length > MAX_FILE_SIZE
  ) {
    return res.status(400).json({
      error: "Bilagan får vara högst 3 MB.",
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO;

  if (!apiKey || !from || !to) {
    return res.status(500).json({
      error: "Mejltjänsten är inte konfigurerad.",
    });
  }

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Kontaktförfrågan: ${name.replace(/[\r\n]/g, " ")}`,
      text: [
        "Ny kontaktförfrågan från hemsidan",
        "",
        `Namn: ${name}`,
        `E-post: ${email}`,
        `Telefon: ${phone || "–"}`,
        `Företag: ${company || "–"}`,
        "",
        "Meddelande:",
        message,
      ].join("\n"),
      ...(attachment
        ? {
            attachments: [
              {
                filename: attachment.filename,
                content: attachment.content,
              },
            ],
          }
        : {}),
    });

    if (error) {
      return res.status(502).json({
        error: "Meddelandet kunde inte skickas. Försök igen senare.",
      });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(502).json({
      error: "Mejltjänsten kunde inte nås. Försök igen senare.",
    });
  }
}