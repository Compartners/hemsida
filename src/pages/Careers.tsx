import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Upload, Send, Briefcase, CheckCircle } from "lucide-react";

const applicationSchema = z.object({
  name: z.string().trim().min(1, "Namn krävs").max(100, "Max 100 tecken"),
  phone: z.string().trim().min(1, "Telefonnummer krävs").max(20, "Max 20 tecken"),
  email: z.string().trim().email("Ogiltig e-postadress").max(255, "Max 255 tecken"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const Careers = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Fel filformat",
          description: "Vänligen ladda upp en PDF eller Word-fil",
          variant: "destructive",
        });
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Filen är för stor",
          description: "Max filstorlek är 10MB",
          variant: "destructive",
        });
        return;
      }
      setCvFile(file);
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!cvFile) {
      toast({
        title: "CV saknas",
        description: "Vänligen bifoga ditt CV",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload CV to storage
      const fileExtension = cvFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("cv-uploads")
        .upload(fileName, cvFile);

      if (uploadError) {
        throw new Error("Kunde inte ladda upp CV");
      }

      // Call edge function to send email
      const { error: functionError } = await supabase.functions.invoke(
        "send-job-application",
        {
          body: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            cvPath: fileName,
          },
        }
      );

      if (functionError) {
        throw new Error(functionError.message);
      }

      setIsSubmitted(true);
      reset();
      setCvFile(null);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Något gick fel",
        description: "Kunde inte skicka ansökan. Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Tack för din ansökan!
              </h1>
              <p className="text-muted-foreground mb-8">
                Vi har mottagit din ansökan och återkommer så snart som möjligt.
              </p>
              <Button variant="outline" asChild>
                <a href="/">Tillbaka till startsidan</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Jobba hos Compartners – Karriär inom företagstelefoni"
        description="Vill du jobba med företagstelefoni? Skicka in din ansökan till Compartners och bli en del av vårt team."
      />
      <Navbar />
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-card mb-6">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Karriär</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Jobba hos{" "}
              <span className="text-gradient">Compartners</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Vill du bli en del av vårt team? Skicka in din ansökan så hör vi av oss!
            </p>
          </div>

          {/* Form */}
          <div className="max-w-lg mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-card border border-border/50">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Namn *
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Ditt namn"
                    className="bg-muted/50 border-border"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">
                    Telefonnummer *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="Ditt telefonnummer"
                    className="bg-muted/50 border-border"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    E-post *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Din e-postadress"
                    className="bg-muted/50 border-border"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* CV Upload */}
                <div className="space-y-2">
                  <Label htmlFor="cv" className="text-foreground">
                    Bifoga CV *
                  </Label>
                  <div className="relative">
                    <input
                      id="cv"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-3 p-4 bg-muted/50 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <Upload className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {cvFile ? cvFile.name : "Välj fil (PDF eller Word)"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Max 10MB</p>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Skickar..."
                  ) : (
                    <>
                      Skicka ansökan
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
