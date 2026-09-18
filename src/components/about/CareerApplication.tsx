import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowRight,
  CheckCircle,
  FileText,
  Send,
  Upload,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Namn krävs")
    .max(100, "Max 100 tecken"),

  phone: z
    .string()
    .trim()
    .min(1, "Telefonnummer krävs")
    .max(20, "Max 20 tecken"),

  email: z
    .string()
    .trim()
    .email("Ogiltig e-postadress")
    .max(255, "Max 255 tecken"),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function CareerApplication() {
  const { toast } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Fel filformat",
        description: "Ladda upp en PDF- eller Word-fil.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Filen är för stor",
        description: "Max filstorlek är 10 MB.",
        variant: "destructive",
      });

      event.target.value = "";
      return;
    }

    setCvFile(file);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!cvFile) {
      toast({
        title: "CV saknas",
        description: "Bifoga ditt CV innan du skickar ansökan.",
        variant: "destructive",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("cv", cvFile);

      const response = await fetch("/api/applications/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Kunde inte skicka ansökan");
      }

      reset();
      setCvFile(null);
      setIsSubmitted(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);

      toast({
        title: "Något gick fel",
        description: "Kunde inte skicka ansökan. Försök igen senare.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="karriar"
      className="relative overflow-hidden bg-[#111724] py-20 text-white md:py-24 lg:py-32"
    >
      <div className="pointer-events-none absolute bottom-[-220px] right-[-180px] h-[600px] w-[600px] rounded-full bg-[#2CCEC2]/10 blur-[160px]" />

      <div className="mx-auto grid w-full max-w-[1240px] gap-16 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        {/* Copy */}
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2]" />

            Karriär
          </div>

          <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[50px] md:text-[60px] lg:text-[68px]">
            Vill du bygga nästa generations
            företagskommunikation med oss?
          </h2>

          <p className="mt-6 max-w-[520px] text-[16px] leading-8 text-white/55">
            Vi är alltid intresserade av människor som gillar teknik,
            affärer och att göra komplicerade saker enklare.
          </p>

          <div className="mt-10 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/25">
            <span className="h-px w-10 bg-gradient-to-r from-[#0B72FE] to-[#2CCEC2]" />

            Compartners / Karriär
          </div>
        </div>

        {/* Form / success */}
        <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl md:p-8">
          {isSubmitted ? (
            <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#2CCEC2]/10">
                <CheckCircle
                  size={30}
                  strokeWidth={1.6}
                  className="text-[#2CCEC2]"
                />
              </div>

              <h3 className="mt-6 text-[30px] font-semibold tracking-[-0.04em]">
                Tack för din ansökan!
              </h3>

              <p className="mt-3 max-w-[420px] leading-7 text-white/50">
                Vi har tagit emot dina uppgifter och återkommer om vi ser
                en möjlighet som passar.
              </p>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white"
              >
                Skicka en ny ansökan
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                label="Namn"
                error={errors.name?.message}
              >
                <input
                  {...register("name")}
                  placeholder="Ditt namn"
                  className={inputClasses}
                />
              </FormField>

              <FormField
                label="Telefonnummer"
                error={errors.phone?.message}
              >
                <input
                  type="tel"
                  {...register("phone")}
                  placeholder="Ditt telefonnummer"
                  className={inputClasses}
                />
              </FormField>

              <FormField
                label="E-post"
                error={errors.email?.message}
              >
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Din e-postadress"
                  className={inputClasses}
                />
              </FormField>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  CV *
                </label>

                <label
                  className="
                    group flex min-h-[84px] cursor-pointer items-center gap-4
                    rounded-[18px] border border-dashed border-white/15
                    bg-white/[0.035] px-5 transition
                    hover:border-[#12B4F0]/40 hover:bg-white/[0.055]
                  "
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-white/[0.07] text-[#2CCEC2]">
                    {cvFile ? (
                      <FileText size={18} />
                    ) : (
                      <Upload size={18} />
                    )}
                  </div>

                  <div>
                    <span className="block text-sm font-medium text-white/80">
                      {cvFile
                        ? cvFile.name
                        : "Välj CV"}
                    </span>

                    <span className="mt-1 block text-xs text-white/30">
                      PDF eller Word · max 10 MB
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group flex min-h-[52px] w-full items-center justify-center gap-2
                  rounded-full bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
                  px-6 text-sm font-semibold text-white
                  transition-all duration-300
                  hover:-translate-y-0.5
                  disabled:cursor-not-allowed disabled:opacity-50
                "
              >
                {isSubmitting ? (
                  "Skickar..."
                ) : (
                  <>
                    Skicka ansökan

                    <Send
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputClasses = `
  h-[52px]
  w-full
  rounded-[14px]
  border
  border-white/10
  bg-white/[0.05]
  px-4
  text-sm
  text-white
  outline-none
  placeholder:text-white/25
  transition
  focus:border-[#12B4F0]/50
  focus:bg-white/[0.07]
`;

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white/80">
        {label} *
      </label>

      {children}

      {error && (
        <p className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}