import {
  PackageCheck,
  ShoppingCart,
  Truck,
  Smartphone,
} from "lucide-react";

const HERO_FEATURES = [
  {
    icon: Truck,
    text: "Snabb leverans till företaget",
  },
  {
    icon: PackageCheck,
    text: "Företagsanpassade enheter",
  },
  {
    icon: ShoppingCart,
    text: "Samlad beställning och historik",
  },
];

export function ShopHero() {
  return (
    <section className="relative overflow-hidden bg-[#0B1018] pb-20 pt-40 text-white md:pb-24 md:pt-44">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-[-180px] top-[-160px] h-[620px] w-[620px] rounded-full bg-[#0B72FE]/14 blur-[160px]" />

      <div className="pointer-events-none absolute bottom-[-280px] left-[18%] h-[520px] w-[700px] rounded-full bg-[#2CCEC2]/8 blur-[170px]" />

      <div className="relative mx-auto grid w-full max-w-[1240px] gap-14 px-5 md:px-8 lg:grid-cols-[1fr_0.62fr] lg:items-center">
        {/* Copy */}
        <div className="max-w-[760px]">
          <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2CCEC2]" />
            Compartners Webbshop
          </div>

          <h1 className="text-[48px] font-semibold leading-[0.95] tracking-[-0.06em] sm:text-[60px] md:text-[74px]">
            Rätt utrustning.
            <br />
            Redo för arbetsdagen.
          </h1>

          <p className="mt-6 max-w-[650px] text-[16px] leading-8 text-white/55 md:text-[18px]">
            Mobiler, surfplattor och tillbehör för företaget — med era
            villkor, policyer och beställningar samlade på ett ställe.
          </p>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {HERO_FEATURES.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="
                  flex items-center gap-3
                  rounded-[16px]
                  border border-white/10
                  bg-white/[0.045]
                  px-4 py-3.5
                  text-xs text-white/60
                  backdrop-blur-xl
                "
              >
                <Icon
                  size={16}
                  strokeWidth={1.6}
                  className="shrink-0 text-[#2CCEC2]"
                />

                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Product / portal visual */}
        <div className="relative hidden min-h-[430px] lg:block">
          <div
            className="
              absolute inset-[4%]
              overflow-hidden
              rounded-[30px]
              border border-white/10
              bg-white/[0.045]
              shadow-[0_30px_90px_rgba(0,0,0,0.24)]
              backdrop-blur-xl
            "
          >
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#2CCEC2]" />

                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-white/35">
                  Företagskonto
                </span>
              </div>

              <span className="text-[10px] text-white/25">
                Webbshop
              </span>
            </div>

            {/* products */}
            <div className="grid grid-cols-2 gap-3 p-5">
              <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                <div className="grid aspect-square place-items-center rounded-[14px] bg-white/[0.05]">
                  <Smartphone
                    size={42}
                    strokeWidth={1.2}
                    className="text-white/35"
                  />
                </div>

                <div className="mt-4">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
                    Mobil
                  </span>

                  <div className="mt-2 h-2 w-[75%] rounded-full bg-white/10" />
                  <div className="mt-2 h-2 w-[45%] rounded-full bg-white/[0.06]" />
                </div>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-white/[0.04] p-4">
                <div className="grid aspect-square place-items-center rounded-[14px] bg-white/[0.05]">
                  <PackageCheck
                    size={42}
                    strokeWidth={1.2}
                    className="text-[#2CCEC2]/60"
                  />
                </div>

                <div className="mt-4">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
                    Tillbehör
                  </span>

                  <div className="mt-2 h-2 w-[68%] rounded-full bg-white/10" />
                  <div className="mt-2 h-2 w-[40%] rounded-full bg-white/[0.06]" />
                </div>
              </div>
            </div>

            {/* status */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-[16px] border border-white/10 bg-white/[0.05] px-4 py-3">
              <div>
                <span className="block font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
                  Företagspolicy
                </span>

                <span className="mt-1 block text-xs font-medium text-white/70">
                  Aktiv
                </span>
              </div>

              <span className="h-2 w-2 rounded-full bg-[#2CCEC2] shadow-[0_0_14px_rgba(44,206,194,0.55)]" />
            </div>
          </div>

          {/* floating order */}
          <div
            className="
              absolute right-[-3%] top-[18%]
              rounded-[16px]
              border border-white/10
              bg-[#111724]/90
              px-4 py-3
              shadow-[0_20px_60px_rgba(0,0,0,0.25)]
              backdrop-blur-xl
            "
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
              Senaste order
            </span>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#2CCEC2]" />

              <span className="text-xs font-semibold text-white/75">
                Registrerad
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}