import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  HeadphonesIcon,
  Upload,
  X,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ACCEPTED_FILES = ".pdf,.doc,.docx,.xls,.xlsx";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Namn krävs")
    .max(100, "Namn får max vara 100 tecken"),
  email: z
    .string()
    .trim()
    .email("Ogiltig e-postadress")
    .max(255, "E-post får max vara 255 tecken"),
  phone: z
    .string()
    .trim()
    .max(20, "Telefonnummer får max vara 20 tecken"),
  company: z
    .string()
    .trim()
    .max(100, "Företagsnamn får max vara 100 tecken"),
  message: z
    .string()
    .trim()
    .min(1, "Meddelande krävs")
    .max(1000, "Meddelande får max vara 1000 tecken"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type FormErrors = Partial<Record<keyof ContactFormData, string>>;

const EMPTY_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

const contactInfo = [
  {
    icon: Phone,
    label: "Telefon",
    value: "010-210 27 00",
    href: "tel:0102102700",
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

function validateFile(file: File): string | null {
  if (file.size === 0) {
    return "Filen är tom. Välj en annan fil.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "Max filstorlek är 3 MB.";
  }

  if (
    file.name.length > 200 ||
    !/^[^/\\\r\n]+\.(pdf|doc|docx|xls|xlsx)$/i.test(file.name)
  ) {
    return "Välj en PDF-, Word- eller Excel-fil med ett filnamn på högst 200 tecken.";
  }

  return null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string" || !result.includes(",")) {
        reject(new Error("Filen kunde inte läsas."));
        return;
      }

      resolve(result.slice(result.indexOf(",") + 1));
    };

    reader.onerror = () => {
      reject(new Error("Filen kunde inte läsas. Försök välja den igen."));
    };

    reader.onabort = () => {
      reject(new Error("Inläsningen av filen avbröts."));
    };

    reader.readAsDataURL(file);
  });
}

export default function Contact() {
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    ...EMPTY_FORM,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    // Gör att samma fil kan väljas igen efter borttagning.
    event.target.value = "";

    if (!file) return;

    const error = validateFile(file);

    if (error) {
      toast({
        title: "Filen kunde inte bifogas",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submittingRef.current) return;

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: FormErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        fieldErrors[field] ??= issue.message;
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (selectedFile) {
      const error = validateFile(selectedFile);

      if (error) {
        toast({
          title: "Kontrollera bilagan",
          description: error,
          variant: "destructive",
        });
        return;
      }
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const attachment = selectedFile
        ? {
            filename: selectedFile.name,
            content: await fileToBase64(selectedFile),
          }
        : undefined;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...result.data,
          attachment,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success !== true) {
        const fallback =
          response.status === 413
            ? "Bilagan är för stor. Välj en mindre fil."
            : "Meddelandet kunde inte skickas. Försök igen om en stund.";

        throw new Error(
          typeof payload?.error === "string" ? payload.error : fallback,
        );
      }

      setFormData({ ...EMPTY_FORM });
      setSelectedFile(null);

      toast({
        title: "Tack för din förfrågan!",
        description: "Ditt meddelande har skickats. Vi hör av oss så snart vi kan.",
      });
    } catch (error) {
      toast({
        title: "Det gick inte att skicka",
        description:
          error instanceof Error
            ? error.message
            : "Försök igen om en stund.",
        variant: "destructive",
      });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <section id="kontakt" className="bg-muted/40 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Kontaktuppgifter */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Kontakt
            </span>

            <h2 className="mb-6 mt-4 font-display text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
              Kontakta oss <span className="text-white">idag</span>
            </h2>

            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Har ni frågor om våra tjänster eller vill veta mer om hur vi kan
              hjälpa ert företag? Fyll i formuläret så hör vi av oss – eller
              lämna ert telefonnummer så ringer vi upp!
            </p>

            <p className="mb-6 font-display text-2xl font-bold text-white">
              #comsåblirvipartners
            </p>

            <div className="space-y-6">
              {contactInfo.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-4"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <item.icon
                      className="h-6 w-6 text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">
                      {item.label}
                    </div>

                    <div className="font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                      {item.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Kontaktformulär */}
          <div className="rounded-3xl border border-border/50 bg-card p-8 shadow-card md:p-10">
            <div className="mb-6 flex items-center gap-3">
              <Calendar
                className="h-6 w-6 text-primary"
                aria-hidden="true"
              />

              <h3 className="font-display text-xl font-bold text-foreground">
                Boka möte med oss
              </h3>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-busy={isSubmitting}
            >
              <fieldset
                disabled={isSubmitting}
                className="m-0 min-w-0 space-y-5 border-0 p-0"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="contact-name"
                    className="font-medium text-foreground"
                  >
                    Namn *
                  </Label>

                  <Input
                    id="contact-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ditt namn"
                    value={formData.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    className="h-12 rounded-xl border-border text-foreground focus:border-primary"
                    maxLength={100}
                    required
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={
                      errors.name ? "contact-name-error" : undefined
                    }
                  />

                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contact-email"
                    className="font-medium text-foreground"
                  >
                    E-post *
                  </Label>

                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="din@email.se"
                    value={formData.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className="h-12 rounded-xl border-border text-foreground focus:border-primary"
                    maxLength={255}
                    required
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "contact-email-error" : undefined
                    }
                  />

                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contact-phone"
                    className="font-medium text-foreground"
                  >
                    Telefon{" "}
                    <span className="font-normal text-muted-foreground">
                      (om du vill bli uppringd)
                    </span>
                  </Label>

                  <Input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="070-123 45 67"
                    value={formData.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className="h-12 rounded-xl border-border text-foreground focus:border-primary"
                    maxLength={20}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone ? "contact-phone-error" : undefined
                    }
                  />

                  {errors.phone && (
                    <p
                      id="contact-phone-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contact-company"
                    className="font-medium text-foreground"
                  >
                    Företag
                  </Label>

                  <Input
                    id="contact-company"
                    name="company"
                    autoComplete="organization"
                    placeholder="Ert företagsnamn"
                    value={formData.company}
                    onChange={(event) =>
                      updateField("company", event.target.value)
                    }
                    className="h-12 rounded-xl border-border text-foreground focus:border-primary"
                    maxLength={100}
                    aria-invalid={Boolean(errors.company)}
                    aria-describedby={
                      errors.company ? "contact-company-error" : undefined
                    }
                  />

                  {errors.company && (
                    <p
                      id="contact-company-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.company}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="contact-message"
                    className="font-medium text-foreground"
                  >
                    Meddelande *
                  </Label>

                  <Textarea
                    id="contact-message"
                    name="message"
                    placeholder="Berätta om era behov och önskemål för mötet..."
                    rows={4}
                    value={formData.message}
                    onChange={(event) =>
                      updateField("message", event.target.value)
                    }
                    className="resize-none rounded-xl border-border text-foreground focus:border-primary"
                    maxLength={1000}
                    required
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                  />

                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Bilaga */}
                <div className="space-y-2">
                  <Label
                    htmlFor="contact-file"
                    className="font-medium text-foreground"
                  >
                    Upphandlingsunderlag{" "}
                    <span className="font-normal text-muted-foreground">
                      (valfritt)
                    </span>
                  </Label>

                  <input
                    ref={fileInputRef}
                    id="contact-file"
                    name="attachment"
                    type="file"
                    accept={ACCEPTED_FILES}
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-describedby="contact-file-help"
                  />

                  {selectedFile ? (
                    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
                      <FileText
                        className="h-5 w-5 shrink-0 text-primary"
                        aria-hidden="true"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        aria-label="Ta bort bilagan"
                        className="rounded-full p-2 transition-colors hover:bg-muted disabled:opacity-50"
                      >
                        <X
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/30 disabled:cursor-wait disabled:opacity-50"
                    >
                      <Upload
                        className="h-5 w-5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />

                      <span className="text-sm text-muted-foreground">
                        Klicka för att bifoga fil
                      </span>
                    </button>
                  )}

                  <p
                    id="contact-file-help"
                    className="text-xs leading-5 text-muted-foreground"
                  >
                    PDF, Word eller Excel. Max 3 MB.
                  </p>
                </div>

                <Button
                  type="submit"
                  size="xl"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="h-5 w-5 animate-spin motion-reduce:animate-none"
                        aria-hidden="true"
                      />
                      Skickar...
                    </>
                  ) : (
                    <>
                      Boka möte
                      <Calendar className="h-5 w-5" aria-hidden="true" />
                    </>
                  )}
                </Button>

                <p className="text-center text-xs leading-5 text-muted-foreground">
                  Skicka en mötesförfrågan så återkommer vi och hittar en tid
                  som passar.
                </p>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}