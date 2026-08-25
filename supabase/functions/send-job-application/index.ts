import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface JobApplicationRequest {
  name: string;
  phone: string;
  email: string;
  cvPath: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone, email, cvPath }: JobApplicationRequest = await req.json();

    // Validate required fields
    if (!name || !phone || !email || !cvPath) {
      throw new Error("Alla fält måste fyllas i");
    }

    // Create Supabase client with service role to read the CV file
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Download the CV file
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("cv-uploads")
      .download(cvPath);

    if (downloadError) {
      console.error("Error downloading CV:", downloadError);
      throw new Error("Kunde inte ladda ner CV-filen");
    }

    // Convert file to base64 for email attachment
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Content = btoa(
      new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
    );

    // Get file extension for content type
    const fileName = cvPath.split("/").pop() || "cv.pdf";
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "pdf";
    const contentTypeMap: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    const contentType = contentTypeMap[fileExtension] || "application/octet-stream";

    // Send email using Resend API directly
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Compartners Jobbansökan <noreply@compartners.se>",
        to: ["info@compartners.se"],
        subject: `Ny jobbansökan från ${name}`,
        html: `
          <h1>Ny jobbansökan</h1>
          <p>En ny jobbansökan har inkommit via hemsidan.</p>
          <h2>Kontaktuppgifter</h2>
          <ul>
            <li><strong>Namn:</strong> ${name}</li>
            <li><strong>Telefon:</strong> ${phone}</li>
            <li><strong>E-post:</strong> <a href="mailto:${email}">${email}</a></li>
          </ul>
          <p>CV finns bifogat i detta mail.</p>
        `,
        attachments: [
          {
            filename: fileName,
            content: base64Content,
            content_type: contentType,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Resend API error:", errorData);
      throw new Error("Kunde inte skicka e-post");
    }

    console.log("Job application email sent successfully");

    // Clean up the uploaded file after sending
    await supabase.storage.from("cv-uploads").remove([cvPath]);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-job-application function:", error);
    const errorMessage = error instanceof Error ? error.message : "Ett fel uppstod";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
