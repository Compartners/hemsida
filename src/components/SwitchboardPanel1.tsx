export type SwitchboardPanelProps = {
  /** Sökväg/URL till videofilen. Default: /src/assets/lynes.mp4 */
  videoSrc?: string;

  /** Rubrik på vänstersidan. */
  title?: string;

  /** Beskrivningstext på vänstersidan. */
  description?: string;
};

/**
 * 30/70 växeltavla med video.
 *
 * Mobil: Vertikal layout med generös padding och centrerad/optimerad typografi.
 * Desktop (lg+): 30/70 split med vertikal centrering.
 */
export default function SwitchboardPanel1({
  videoSrc = "/src/assets/lynes.mp4",
  title = "Inga samtal lämnas åt slumpen.",
  description = "Se vem som är tillgänglig, vem som pratar och vem som är redo att svara — direkt i växeln.",
}: SwitchboardPanelProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
      <div className="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-10 lg:gap-14 xl:gap-16">
        
        {/* ============================================================
            VÄNSTER — TEXT (30% på lg+)
        ============================================================ */}
        <div className="flex flex-col justify-center lg:col-span-3">
          <span className="mb-3 inline-block font-mono text-xs font-medium uppercase tracking-wider text-primary sm:mb-4">
            alltid någon som svarar
          </span>

          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {title}
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-base lg:text-sm xl:text-base">
            {description}
          </p>
        </div>

        {/* ============================================================
            HÖGER — VIDEO (70% på lg+)
        ============================================================ */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm sm:rounded-3xl lg:col-span-7">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="aspect-video h-full w-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}