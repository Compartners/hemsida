import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  filePath?: string;
  fileName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, company, message, filePath, fileName }: ContactFormRequest = await req.json();

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error("Namn, e-post och meddelande krävs");
    }

    // Send email using Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    let attachments: Array<{ filename: string; content: string; content_type: string }> = [];

    // If there's a file, download and attach it
    if (filePath && fileName) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);

      const { data: fileData, error: downloadError } = await supabase.storage
        .from("procurement-docs")
        .download(filePath);

      if (downloadError) {
        console.error("Error downloading file:", downloadError);
        throw new Error("Kunde inte ladda ner filen");
      }

      // Convert file to base64
      const arrayBuffer = await fileData.arrayBuffer();
      const base64Content = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
      );

      // Get content type
      const fileExtension = fileName.split(".").pop()?.toLowerCase() || "pdf";
      const contentTypeMap: Record<string, string> = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      const contentType = contentTypeMap[fileExtension] || "application/octet-stream";

      attachments = [
        {
          filename: fileName,
          content: base64Content,
          content_type: contentType,
        },
      ];

      // Clean up the file after processing
      await supabase.storage.from("procurement-docs").remove([filePath]);
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Compartners Hemsida <noreply@compartners.se>",
        to: ["info@compartners.se"],
        reply_to: email,
        subject: `Mötesförfrågan från ${name}${company ? ` (${company})` : ""}`,
        html: `
          <h1>Ny mötesförfrågan</h1>
          <p>En ny mötesförfrågan har inkommit via hemsidan.</p>
          <h2>Kontaktuppgifter</h2>
          <ul>
            <li><strong>Namn:</strong> ${name}</li>
            <li><strong>E-post:</strong> <a href="mailto:${email}">${email}</a></li>
            ${phone ? `<li><strong>Telefon:</strong> ${phone}</li>` : ""}
            ${company ? `<li><strong>Företag:</strong> ${company}</li>` : ""}
          </ul>
          <h2>Meddelande</h2>
          <p style="white-space: pre-wrap;">${message}</p>
          ${phone ? `<p><em>Kunden har angett telefonnummer och vill eventuellt bli uppringd.</em></p>` : ""}
          ${attachments.length > 0 ? `<p><strong>📎 Bifogat upphandlingsunderlag:</strong> ${fileName}</p>` : ""}
        `,
        ...(attachments.length > 0 && { attachments }),
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error("Kunde inte skicka e-post");
    }

    console.log("Meeting request email sent successfully to info@compartners.se");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-contact-form function:", error);
    const errorMessage = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
