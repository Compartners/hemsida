import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { z } from "zod";

const MAX_CV_SIZE = 3 * 1024 * 1024;

const applicationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
  role: z.enum([
    "Försäljning",
    "Teknik och support",
    "Kundrelationer",
    "Annat / spontanansökan",
  ]),
  message: z.string().trim().min(20).max(5000),
  website: z.string().max(1000).optional(),
  attachment: z.object({
    filename: z.string().min(1).max(200)
      .regex(/^[^/\\\r\n]+\.(pdf|docx)$/i),
    content: z.string().min(4)
      .max(4 * Math.ceil(MAX_CV_SIZE / 3))
      .regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/),
  }).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metoden stöds inte." });
  }

  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Kontrollera namn, mejladress, område och presentation (minst 20 tecken). CV ska vara PDF eller DOCX, högst 3 MB.",
    });
  }

  const { name, email, phone, role, message, website, attachment } = parsed.data;

  // Dolt fält som vanliga besökare lämnar tomt.
  if (website?.trim()) return res.status(200).json({ ok: true });

  if (attachment) {
    const bytes = Buffer.from(attachment.content, "base64");
    if (!bytes.length || bytes.length > MAX_CV_SIZE) {
      return res.status(400).json({ error: "CV:t får inte vara tomt eller större än 3 MB." });
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.APPLICATION_TO || process.env.CONTACT_TO;
  if (!apiKey || !from || !to) {
    return res.status(500).json({ error: "Mejltjänsten är inte konfigurerad." });
  }

  const requestId = req.headers["x-request-id"];
  if (typeof requestId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) {
    return res.status(400).json({ error: "Uppdatera sidan och försök igen." });
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Jobbansökan: ${role} – ${name.replace(/[\r\n]/g, " ")}`,
      text: [
        "Ny jobbansökan från Compartners hemsida",
        "",
        `Namn: ${name}`,
        `Mejladress: ${email}`,
        `Telefon: ${phone || "–"}`,
        `Område: ${role}`,
        "",
        "Presentation:",
        message,
        "",
        attachment ? "CV bifogas." : "Inget CV bifogat.",
      ].join("\n"),
      ...(attachment ? { attachments: [attachment] } : {}),
    }, { idempotencyKey: `job-application/${requestId}` });

    if (error || !data?.id) {
      return res.status(502).json({ error: "Ansökan kunde inte skickas. Försök igen om en stund." });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(502).json({ error: "Mejltjänsten kunde inte nås. Försök igen om en stund." });
  }
}
