import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Mail, Phone, HeadphonesIcon, Upload, X, FileText, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Namn krävs").max(100, "Namn får max vara 100 tecken"),
  email: z.string().trim().email("Ogiltig e-postadress").max(255, "E-post får max vara 255 tecken"),
  phone: z.string().trim().max(20, "Telefonnummer får max vara 20 tecken").optional(),
  company: z.string().trim().max(100, "Företagsnamn får max vara 100 tecken").optional(),
  message: z.string().trim().min(1, "Meddelande krävs").max(1000, "Meddelande får max vara 1000 tecken"),
});

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; company?: string; message?: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Filen är för stor",
          description: "Max filstorlek är 10 MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string; phone?: string; company?: string; message?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      let filePath: string | undefined;

      // Upload file if selected
      if (selectedFile) {
        setIsUploading(true);
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("procurement-docs")
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw new Error("Kunde inte ladda upp filen");
        }
        filePath = fileName;
        setIsUploading(false);
      }

      const { data, error } = await supabase.functions.invoke("send-contact-form", {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          message: formData.message,
          filePath: filePath,
          fileName: selectedFile?.name,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Tack för din förfrågan! 🎉",
        description: "Vi återkommer till dig så snart som möjligt för att boka möte.",
      });
      
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast({
        title: "Något gick fel",
        description: "Försök igen eller kontakta oss direkt via telefon.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Telefon",
      value: "010-210 27 00",
      href: "tel:010-2102700",
    },
    {
      icon: Mail,
      label: "Allmänna frågor",
      value: "info@compartners.se",
      href: "mailto:info@compartners.se",
    },
    {
      icon: HeadphonesIcon,
      label: "Support",
      value: "support@compartners.se",
      href: "mailto:support@compartners.se",
    },
  ];

  return (
    <section id="kontakt" className="py-24 md:py-32 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Kontakt</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-6">
              Kontakta oss{" "}
              <span className="text-white">idag</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Har ni frågor om våra tjänster eller vill veta mer om hur vi kan 
              hjälpa ert företag? Fyll i formuläret så hör vi av oss – eller lämna 
              ert telefonnummer så ringer vi upp!
            </p>

            <p className="text-2xl font-display font-bold text-white mb-6">
              #comsåblirvipartners
            </p>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{item.label}</div>
                    <div className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-card rounded-3xl p-8 md:p-10 shadow-card border border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="font-display text-xl font-bold text-foreground">
                Boka möte med oss
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-medium">
                  Namn *
                </Label>
                <Input
                  id="name"
                  placeholder="Ditt namn"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 rounded-xl border-border focus:border-primary"
                  maxLength={100}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">
                  E-post *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@email.se"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl border-border focus:border-primary"
                  maxLength={255}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="font-medium">
                  Telefon <span className="text-muted-foreground font-normal">(om du vill bli uppringd)</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="070-123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-12 rounded-xl border-border focus:border-primary"
                  maxLength={20}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="font-medium">
                  Företag
                </Label>
                <Input
                  id="company"
                  placeholder="Ert företagsnamn"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="h-12 rounded-xl border-border focus:border-primary"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="font-medium">
                  Meddelande *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Berätta om era behov och önskemål för mötet..."
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="rounded-xl border-border focus:border-primary resize-none"
                  maxLength={1000}
                />
                {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="font-medium">
                  Upphandlingsunderlag <span className="text-muted-foreground font-normal">(valfritt)</span>
                </Label>
                {selectedFile ? (
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                    <FileText className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground truncate flex-1">{selectedFile.name}</span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="p-1 hover:bg-muted rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Klicka för att bifoga fil (PDF, Word, max 10 MB)
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <Button
                type="submit"
                size="xl"
                className="w-full"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting ? (
                  isUploading ? "Laddar upp fil..." : "Skickar..."
                ) : (
                  <>
                    Boka möte
                    <Calendar className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
