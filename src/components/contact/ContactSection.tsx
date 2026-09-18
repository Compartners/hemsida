import { useState } from "react";
import { ArrowRight, CheckCircle, Mail, Phone } from "lucide-react";

type ContactFormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

const initialForm: ContactFormData = {
  name: "",
  company: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (
    field: keyof ContactFormData,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Kunde inte skicka formuläret");
      }

      setIsSubmitted(true);
      setForm(initialForm);
    } catch (error) {
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="kontakt"
      className="relative overflow-hidden bg-[#050607] py-20 text-white md:py-24 lg:py-32"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute bottom-[-250px] left-[-150px] h-[600px] w-[600px] rounded-full bg-[#0B72FE]/10 blur-[160px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[-180px] h-[520px] w-[520px] rounded-full bg-[#2CCEC2]/10 blur-[150px]" />

      <div className="relative mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
        
        {/* Left */}
        <div>
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2]" />

            Kontakt
          </div>

          <h2 className="text-[42px] font-semibold leading-[0.98] tracking-[-0.055em] sm:text-[50px] md:text-[60px] lg:text-[68px]">
            Börja med behovet.
            <br />
            Inte produkten.
          </h2>

          <p className="mt-6 max-w-[500px] text-[16px] leading-8 text-white/55">
            Berätta kort hur ni arbetar idag och vad ni vill förbättra.
            Vi återkommer och hjälper er reda ut vad nästa steg faktiskt
            behöver vara.
          </p>

          <div className="mt-10 space-y-4">
            <a
              href="tel:0102102700"
              className="flex items-center gap-3 text-sm text-white/65 transition hover:text-white"
            >
              <Phone
                size={17}
                strokeWidth={1.7}
                className="text-[#2CCEC2]"
              />

              010-210 27 00
            </a>

            <a
              href="mailto:info@compartners.se"
              className="flex items-center gap-3 text-sm text-white/65 transition hover:text-white"
            >
              <Mail
                size={17}
                strokeWidth={1.7}
                className="text-[#2CCEC2]"
              />

              info@compartners.se
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-[28px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl md:p-8">
          {isSubmitted ? (
            <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-[#2CCEC2]/10">
                <CheckCircle
                  size={30}
                  strokeWidth={1.6}
                  className="text-[#2CCEC2]"
                />
              </div>

              <h3 className="mt-6 text-[30px] font-semibold tracking-[-0.04em]">
                Tack!
              </h3>

              <p className="mt-3 max-w-[390px] leading-7 text-white/50">
                Vi har tagit emot ditt meddelande och återkommer så snart
                vi kan.
              </p>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-7 text-sm font-semibold text-white"
              >
                Skicka ett nytt meddelande
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Namn *">
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="Ditt namn"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Företag">
                  <input
                    value={form.company}
                    onChange={(e) =>
                      updateField("company", e.target.value)
                    }
                    placeholder="Företagsnamn"
                    className={inputClasses}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="E-post *">
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="namn@foretag.se"
                    className={inputClasses}
                  />
                </Field>

                <Field label="Telefon">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    placeholder="070-000 00 00"
                    className={inputClasses}
                  />
                </Field>
              </div>

              <Field label="Vad vill ni ha hjälp med? *">
                <textarea
                  required
                  value={form.message}
                  onChange={(e) =>
                    updateField("message", e.target.value)
                  }
                  placeholder="Berätta kort om nuläget eller vad ni vill förbättra..."
                  rows={5}
                  className={`${inputClasses} min-h-[140px] resize-none py-4`}
                />
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  group mt-1 flex min-h-[52px] items-center
                  justify-center gap-2 rounded-full
                  bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
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
                    Skicka förfrågan

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] leading-5 text-white/25">
                Genom att skicka formuläret godkänner du att Compartners
                kontaktar dig angående din förfrågan.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputClasses = `
  w-full
  rounded-[14px]
  border
  border-white/10
  bg-white/[0.05]
  px-4
  h-[52px]
  text-sm
  text-white
  outline-none
  placeholder:text-white/25
  transition
  focus:border-[#12B4F0]/50
  focus:bg-white/[0.07]
`;

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-medium text-white/75">
        {label}
      </span>

      {children}
    </label>
  );
}