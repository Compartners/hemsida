import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

import fogVideo from "@/assets/fog_video.mp4";
import fogBild from "@/assets/fog_bild.png";

import halloweenVideo from "@/assets/fall.mp4";
import halloweenBild from "@/assets/fall.png";

import christmasVideo from "@/assets/winter.mp4";
import christmasBild from "@/assets/winter.png";

import springVideo from "@/assets/spring.mp4";
import springBild from "@/assets/spring.png";

import summerVideo from "@/assets/summer.mp4";
import summerBild from "@/assets/summer.png";

type ThemeId = "fog" | "fall" | "winter" | "spring" | "summer";
type MediaMode = "video" | "image";
type Brightness = Record<ThemeId, Record<MediaMode, number>>;
type Period = { start: string; end: string } | null;

// Årliga perioder i MM-DD-format. Lämna null tills du valt datum.
// Exempel: fall: { start: "10-20", end: "11-02" }
// Perioder över årsskiftet fungerar också, t.ex. 12-01 till 01-06.
// Vid överlappning prioriteras fall, sedan winter.
const THEME_DATES: Record<Exclude<ThemeId, "fog">, Period> = {
  fall: { start: "10-20", end: "11-10" },
  winter: { start: "12-01", end: "01-06" },
  spring: { start: "03-20", end: "04-10" },
  summer: { start: "06-20", end: "07-10" },
};

// Klistra in värden från testpanelens "Kopiera inställningar" här.
const DEFAULT_BRIGHTNESS: Brightness = {
  fog: { video: 0.8, image: 0.8 },
  fall: { video: 0.65, image: 0.65 },
  winter: { video: 0.8, image: 0.8 },
  spring: { video: 0.8, image: 0.8 },
  summer: { video: 0.8, image: 0.8 },
};

const THEMES = {
  fog: { label: "Fog", video: fogVideo, image: fogBild },
  fall: { label: "Höst", video: halloweenVideo, image: halloweenBild },
  winter: { label: "Vinter", video: christmasVideo, image: christmasBild },
  spring: { label: "Vår", video: springVideo, image: springBild },
  summer: { label: "Sommar", video: summerVideo, image: summerBild },
} satisfies Record<ThemeId, { label: string; video: string; image: string }>;
const THEME_IDS: ThemeId[] = ["fog", "fall", "winter", "spring", "summer"];
const STORAGE_KEY = "compartners.hero.brightness.v1";

function getTheme(date: Date): ThemeId {
  const today = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  for (const id of ["fall", "winter", "spring", "summer"] as const) {
    const period = THEME_DATES[id];
    if (!period) continue;
    const active = period.start <= period.end
      ? today >= period.start && today <= period.end
      : today >= period.start || today <= period.end;
    if (active) return id;
  }
  return "fog";
}

function readBrightness(): Brightness {
  const result: Brightness = JSON.parse(JSON.stringify(DEFAULT_BRIGHTNESS));
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    for (const id of THEME_IDS) {
      for (const mode of ["video", "image"] as const) {
        const value = stored?.[id]?.[mode];
        if (typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 2) {
          result[id][mode] = value;
        }
      }
    }
  } catch { /* Standardvärden används om lagring saknas eller är blockerad. */ }
  return result;
}

interface HeroProps {
  // Testpanelen visas automatiskt i Vite dev. Tvinga vid behov med
  // <Hero showPreviewControls /> eller dölj med <Hero showPreviewControls={false} />.
  showPreviewControls?: boolean;
}

const Hero = ({ showPreviewControls = import.meta.env.DEV }: HeroProps) => {
  const [now, setNow] = useState(() => new Date());
  const [previewTheme, setPreviewTheme] = useState<ThemeId | "auto">("auto");
  const [previewDate, setPreviewDate] = useState("");
  const [mediaMode, setMediaMode] = useState<MediaMode>("video");
  const [brightness, setBrightness] = useState<Brightness>(readBrightness);
  const [showOverlays, setShowOverlays] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [copyStatus, setCopyStatus] = useState("");
  const [playback, setPlayback] = useState<{ source: string; status: "ready" | "error" } | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showPreviewControls) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(brightness)); } catch { /* Ingen lagring. */ }
  }, [brightness, showPreviewControls]);

  const date = showPreviewControls && previewDate
    ? new Date(`${previewDate}T12:00:00`)
    : now;
  const themeId = showPreviewControls && previewTheme !== "auto" ? previewTheme : getTheme(date);
  const theme = THEMES[themeId];
  // Sparade testvärden används bara när testpanelen är aktiverad.
  const levels = (showPreviewControls ? brightness : DEFAULT_BRIGHTNESS)[themeId];
  const useVideo = !showPreviewControls || mediaMode === "video";
  const videoReady = playback?.source === theme.video && playback.status === "ready";
  const videoError = playback?.source === theme.video && playback.status === "error";
  const overlaysVisible = !showPreviewControls || showOverlays;
  const contentVisible = !showPreviewControls || showContent;
  const filterFor = (mode: MediaMode) => `brightness(${levels[mode]}) saturate(0.9) contrast(0.95)`;

  function setLevel(mode: MediaMode, value: number) {
    setBrightness(previous => ({ ...previous, [themeId]: { ...previous[themeId], [mode]: value } }));
  }

  async function copySettings() {
    const code = `const DEFAULT_BRIGHTNESS: Brightness = ${JSON.stringify(brightness, null, 2)};`;
    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus("Kopierat – ersätt DEFAULT_BRIGHTNESS i filen.");
    } catch {
      setCopyStatus("Kopiering blockerad. Kopiera värdena nedan manuellt.");
    }
  }

  return (
    <section className="relative flex min-h-[760px] h-[100vh] max-h-[1020px] items-center overflow-hidden bg-[#050607] text-white">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[#050607]">
        {/* Stillbild visas direkt */}
        <img
          src={theme.image}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="
            absolute inset-0 h-full w-full
            object-cover object-center
            saturate-[0.9] contrast-[0.95]
          "
          style={{
            filter: filterFor("image"),
          }}
        />

        {/* Videon tonar in när den börjar spela */}
        {useVideo && <video
          key={theme.video}
          className={`
            absolute inset-0 h-full w-full
            object-cover object-center
            saturate-[0.9] contrast-[0.95]
            ${showPreviewControls ? "" : "transition-opacity duration-1000"}
            ${videoReady ? "opacity-100" : "opacity-0"}
          `}
          style={{
            filter: filterFor("video"),
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={theme.image}
          aria-hidden="true"
          onLoadStart={() => setPlayback(null)}
          onPlaying={() => setPlayback({ source: theme.video, status: "ready" })}
          onError={() => setPlayback({ source: theme.video, status: "error" })}
        >
          <source src={theme.video} type="video/mp4" />
        </video>}
      </div>

      {overlaysVisible && <>
      {/* DARK OVERLAY */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(50deg,rgba(3,6,10,0.84)_0%,rgba(3,6,10,0.72)_32%,rgba(3,6,10,0.42)_62%,rgba(3,6,10,0.40)_100%)]
        "
      />

      <div
        className="
          absolute inset-0
          bg-[linear-gradient(180deg,rgba(3,6,10,0.22)_0%,rgba(3,6,10,0.05)_55%,rgba(3,6,10,0.38)_100%)]
        "
      />
      

      </>}

      {contentVisible && <>
      {/* CONTENT */}
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-5 pt-16 md:px-8 lg:pt-20">
        <div className="max-w-[900px]">
          {/* Eyebrow */}


          {/* Heading */}
          <h1
            className="
              max-w-[950px]
              text-[52px]
              
              leading-[0.94]
              tracking-[-0.065em]
              sm:text-[44px]
              md:text-[66px]
              lg:text-[82px]
            "
          >
            Kommunikation som
            <br />
            <span className="text-white/90">
              skapar 
               <span className=" bg-gradient-to-r from-[#0B72FE] to-[#2CCEC2] bg-clip-text text-transparent"> klarhet.</span>
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mt-7
              max-w-[670px]
              text-[16px]
              leading-7
              text-white/80
              md:text-[18px]
              md:leading-8
            "
          >
            Vi hjälper företag att få telefoni, smart teknik och support
            att fungera som en sammanhängande del av verksamheten —
            inte som ännu fler system att hantera.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#kontakt"
              className="
                group
                inline-flex min-h-[52px]
                items-center justify-center gap-2.5
                rounded-full
                bg-gradient-to-r
                from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
                px-6
                text-sm font-semibold text-white
                shadow-[0_18px_46px_rgba(11,114,254,0.24)]
                transition-all duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_22px_58px_rgba(11,114,254,0.34)]
              "
            >
              Boka rådgivning
              <ArrowRight
                size={17}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>

            <Link
              to="/tjanster"
              className="
                inline-flex min-h-[52px]
                items-center justify-center
                rounded-full border border-white/20
                bg-white/[0.06] px-6
                text-sm font-medium text-white
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-white/35
                hover:bg-white/[0.10]
              "
            >
              Vad kan vi erbjuda?
            </Link>
          </div>

          {/* Proof */}

          
        </div>
      </div>

      {/* BRAND STATEMENT */}


      </>}

      {overlaysVisible && <>
      {/* BOTTOM FADE */}
      <div
        className="
          pointer-events-none
          absolute bottom-0 left-0
          h-24 w-full
          bg-gradient-to-t from-black/30 to-transparent
        "
      />
      </>}

      {showPreviewControls && (
        <aside aria-label="Testa bakgrund" className="absolute bottom-4 right-4 z-30 max-h-[70vh] w-[min(360px,calc(100%-2rem))] overflow-y-auto rounded-2xl border border-white/20 bg-[#10151c]/95 p-4 text-sm text-white shadow-2xl backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between gap-2">
            <strong>Jämför bakgrunder</strong>
            <span className="text-xs text-white/60">{THEMES[themeId].label}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {(["auto", ...THEME_IDS] as const).map(id => (
              <button key={id} type="button" aria-pressed={previewTheme === id} onClick={() => setPreviewTheme(id)} className={`rounded-lg px-2 py-2 ${previewTheme === id ? "bg-[#12B4F0] text-black" : "bg-white/10 hover:bg-white/20"}`}>
                {id === "auto" ? "Auto" : THEMES[id].label}
              </button>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1">
            {(["video", "image"] as const).map(mode => (
              <button key={mode} type="button" aria-pressed={mediaMode === mode} onClick={() => setMediaMode(mode)} className={`rounded-lg px-3 py-2 ${mediaMode === mode ? "bg-white text-black" : "bg-white/10 hover:bg-white/20"}`}>
                {mode === "video" ? "Video" : "Stillbild"}
              </button>
            ))}
          </div>
          <p aria-live="polite" className="mt-2 text-xs text-white/60">
            {!useVideo ? "Visar stillbild" : videoError ? "Videofel – visar stillbild" : videoReady ? "Videon spelas" : "Laddar video – visar stillbild"}
          </p>
          <div className="mt-4 space-y-3">
            {(["video", "image"] as const).map(mode => (
              <label key={mode} className="block">
                <span className="flex justify-between text-xs">
                  <span>Ljusstyrka · {mode === "video" ? "video" : "stillbild"}</span>
                  <span>{Math.round(levels[mode] * 100)} %</span>
                </span>
                <input aria-label={`Ljusstyrka ${mode}`} type="range" min="0" max="2" step="0.01" value={levels[mode]} onChange={event => setLevel(mode, Number(event.target.value))} className="mt-1 w-full accent-[#2CCEC2]" />
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2"><input type="checkbox" checked={showOverlays} onChange={event => setShowOverlays(event.target.checked)} />Överlägg</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={showContent} onChange={event => setShowContent(event.target.checked)} />Text och knappar</label>
          </div>
          <label className="mt-4 block text-xs">
            Testdatum för Auto
            <input type="date" value={previewDate} onChange={event => { setPreviewDate(event.target.value); setPreviewTheme("auto"); }} className="mt-1 block w-full rounded-lg border border-white/20 bg-white/10 p-2 text-white [color-scheme:dark]" />
          </label>
          {previewDate && <button type="button" onClick={() => setPreviewDate("")} className="mt-1 text-xs underline">Använd dagens datum</button>}
          <p className="mt-2 text-xs leading-5 text-white/50">Fog är standard. Ange perioderna för höst och vinter i THEME_DATES överst i filen. Ljusstyrkan justeras visuellt; den mäts inte automatiskt.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={copySettings} className="flex-1 rounded-lg bg-[#2CCEC2] px-3 py-2 text-xs font-semibold text-black">Kopiera inställningar</button>
            <button type="button" onClick={() => { setBrightness(JSON.parse(JSON.stringify(DEFAULT_BRIGHTNESS))); setCopyStatus(""); }} className="rounded-lg bg-white/10 px-3 py-2 text-xs">Återställ</button>
          </div>
          {copyStatus && <p role="status" className="mt-2 text-xs">{copyStatus}</p>}
          <details className="mt-2 text-xs text-white/60"><summary className="cursor-pointer">Visa alla ljusvärden</summary><pre className="mt-2 overflow-x-auto">{JSON.stringify(brightness, null, 2)}</pre></details>
        </aside>
      )}
    </section>
  );
};

export default Hero;