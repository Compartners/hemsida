import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX, CheckCircle2, LoaderCircle, Send, ArrowDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
// ───────────────────────── Konstanter ─────────────────────────
const W = 420;
const H = 640;
const PADDLE_W = 96;
const PADDLE_H = 14;
const PADDLE_Y = H - 64;
const START_LIVES = 5;
const CATCHES_PER_LEVEL = 12;
const BEST_KEY = "compartners.404.best.v1";
const BLUE = "#0B72FE";
const CYAN = "#12B4F0";
const TEAL = "#2CCEC2";
const RED = "#FF4D5E";
const GOLD = "#FFC83D";
const PURPLE = "#A78BFA";
const ORANGE = "#FB923C";
const SHIELD_BLUE = "#3B8BFF";
type Phase = "idle" | "playing" | "paused" | "over";
type Kind = "call" | "vip" | "spam" | "shield" | "slow" | "magnet";
const COLORS: Record<Kind, string> = {
  call: TEAL,
  vip: GOLD,
  spam: RED,
  shield: SHIELD_BLUE,
  slow: PURPLE,
  magnet: ORANGE,
};
const LEGEND: { color: string; label: string; desc: string }[] = [
  { color: TEAL, label: "Samtal", desc: "Fånga för poäng och kombo" },
  { color: GOLD, label: "VIP-kund", desc: "50 poäng × kombo" },
  { color: RED, label: "Spam", desc: "Undvik, kostar en linje" },
  { color: SHIELD_BLUE, label: "Skydd", desc: "Blockerar ett spam" },
  { color: PURPLE, label: "Slow-mo", desc: "Bromsar tiden" },
  { color: ORANGE, label: "Magnet", desc: "Drar till sig samtal" },
];
// Riktiga DTMF-par (rad-/kolumnfrekvenser) för knapptonerna
const DTMF: [number, number][] = [
  [697, 1209], [697, 1336], [697, 1477],
  [770, 1209], [770, 1336], [770, 1477],
  [852, 1209], [852, 1336], [852, 1477],
];
interface Item { x: number; y: number; r: number; vy: number; kind: Kind; spin: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; color: string; size: number }
interface FloatText { x: number; y: number; text: string; color: string; life: number }
interface Game {
  phase: Phase;
  px: number;
  target: number;
  items: Item[];
  particles: Particle[];
  floats: FloatText[];
  stars: { x: number; y: number; s: number; v: number }[];
  score: number;
  lives: number;
  combo: number;
  maxCombo: number;
  caught: number;
  level: number;
  spawnTimer: number;
  shake: number;
  flash: number;
  levelToast: number;
  shield: boolean;
  slow: number;
  magnet: number;
  time: number;
  keys: { left: boolean; right: boolean };
}
// ───────────────────────── Hjälpfunktioner ─────────────────────────
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
function createGame(): Game {
  return {
    phase: "idle",
    px: W / 2,
    target: W / 2,
    items: [],
    particles: [],
    floats: [],
    stars: Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      s: Math.random() * 1.6 + 0.4,
      v: Math.random() * 30 + 12,
    })),
    score: 0,
    lives: START_LIVES,
    combo: 0,
    maxCombo: 0,
    caught: 0,
    level: 1,
    spawnTimer: 0.6,
    shake: 0,
    flash: 0,
    levelToast: 0,
    shield: false,
    slow: 0,
    magnet: 0,
    time: 0,
    keys: { left: false, right: false },
  };
}
function resetGame(g: Game) {
  g.px = W / 2;
  g.target = W / 2;
  g.keys = { left: false, right: false };
  g.items = [];
  g.particles = [];
  g.floats = [];
  g.score = 0;
  g.lives = START_LIVES;
  g.combo = 0;
  g.maxCombo = 0;
  g.caught = 0;
  g.level = 1;
  g.spawnTimer = 0.6;
  g.shake = 0;
  g.flash = 0;
  g.levelToast = 0;
  g.shield = false;
  g.slow = 0;
  g.magnet = 0;
}
function readBest(): number {
  try {
    const v = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}
function saveBest(v: number) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* Ingen lagring. */ }
}
function pickKind(level: number): Kind {
  const r = Math.random();
  const spam = Math.min(0.34, 0.2 + level * 0.012);
  const vip = spam + 0.05;
  const shield = vip + 0.035;
  const slow = shield + 0.035;
  const magnet = slow + 0.035;
  if (r < spam) return "spam";
  if (r < vip) return "vip";
  if (r < shield) return "shield";
  if (r < slow) return "slow";
  if (r < magnet) return "magnet";
  return "call";
}
function verdict(score: number): string {
  if (score < 60) return "Linjen gick ned redan vid första ringsignalen. Det händer de bästa.";
  if (score < 160) return "Helt okej som telefonist. Kaffet väntar.";
  if (score < 320) return "Imponerande svarstid. Kunderna hade varit nöjda.";
  if (score < 600) return "Det här är växelproffs-nivå. Nästan misstänkt bra.";
  return "Vilken poäng! Vi gillar ditt driv. Hör gärna av dig.";
}
// ───────────────────────── Ritfunktioner ─────────────────────────
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function drawItem(ctx: CanvasRenderingContext2D, it: Item, time: number) {
  const col = COLORS[it.kind];
  ctx.save();
  ctx.translate(it.x, it.y);
  ctx.shadowColor = col;
  ctx.shadowBlur = 18;
  if (it.kind === "vip") {
    ctx.rotate(it.spin * 0.6);
    ctx.fillStyle = col;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const rad = i % 2 === 0 ? it.r + 2 : (it.r + 2) * 0.45;
      const px = Math.cos(a) * rad;
      const py = Math.sin(a) * rad;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    return;
  }
  // Cirkelbas
  ctx.fillStyle = col + "2E";
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, it.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (it.kind === "call") {
    // Pulserande ring
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(0, 0, it.r + 5 + Math.sin(time * 6 + it.spin) * 2.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // Lur
    ctx.rotate(-0.6);
    ctx.fillStyle = "#fff";
    rr(ctx, -8, -3, 16, 5, 2.5);
    ctx.fill();
    rr(ctx, -9, -3, 5, 9, 2.5);
    ctx.fill();
    rr(ctx, 4, -3, 5, 9, 2.5);
    ctx.fill();
  } else if (it.kind === "spam") {
    ctx.shadowBlur = 0;
    ctx.rotate(Math.sin(it.spin * 2) * 0.25);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-6, -6); ctx.lineTo(6, 6);
    ctx.moveTo(6, -6); ctx.lineTo(-6, 6);
    ctx.stroke();
  } else if (it.kind === "shield") {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(7, -5);
    ctx.lineTo(7, 1);
    ctx.quadraticCurveTo(7, 6, 0, 9);
    ctx.quadraticCurveTo(-7, 6, -7, 1);
    ctx.lineTo(-7, -5);
    ctx.closePath();
    ctx.stroke();
  } else if (it.kind === "slow") {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.moveTo(0, 0); ctx.lineTo(0, -5);
    ctx.moveTo(0, 0); ctx.lineTo(4, 0);
    ctx.stroke();
  } else if (it.kind === "magnet") {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(0, 1, 6, 0, Math.PI);
    ctx.moveTo(-6, 1); ctx.lineTo(-6, -6);
    ctx.moveTo(6, 1); ctx.lineTo(6, -6);
    ctx.stroke();
  }
  ctx.restore();
}
// ───────────────────────── Komponent ─────────────────────────
function CareersGame() {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gRef = useRef<Game>(null as unknown as Game);
  if (!gRef.current) gRef.current = createGame();
  const bestRef = useRef<number>(readBest());
  const audioRef = useRef<AudioContext | null>(null);
  const soundRef = useRef(false);
  const reduceMotionRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [sound, setSound] = useState(false);
  const [result, setResult] = useState({ score: 0, best: 0, isNewBest: false, maxCombo: 0, caught: 0 });
  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  // ── Ljud (WebAudio, skapas först när användaren interagerar) ──
  const tone = useCallback((freqs: number[], dur = 0.12, type: OscillatorType = "sine", vol = 0.05) => {
    if (!soundRef.current) return;
    try {
      const Ctor = window.AudioContext
        || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      const ac = audioRef.current ?? (audioRef.current = new Ctor());
      if (ac.state === "suspended") void ac.resume();
      const now = ac.currentTime;
      const gain = ac.createGain();
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      gain.connect(ac.destination);
      for (const f of freqs) {
        const o = ac.createOscillator();
        o.type = type;
        o.frequency.value = f;
        o.connect(gain);
        o.start(now);
        o.stop(now + dur);
      }
    } catch { /* Ljud är valfritt. */ }
  }, []);
  const vibrate = (ms: number) => {
    try { if (!reduceMotionRef.current) navigator.vibrate?.(ms); } catch { /* Stöds inte. */ }
  };
  const start = useCallback(() => {
    const g = gRef.current;
    resetGame(g);
    g.phase = "playing";
    setPhase("playing");
    canvasRef.current?.focus({ preventScroll: true });
    tone([697, 1209], 0.12);
  }, [tone]);
  const togglePause = useCallback(() => {
    const g = gRef.current;
    if (g.phase === "playing") { g.phase = "paused"; setPhase("paused"); }
    else if (g.phase === "paused") { g.phase = "playing"; setPhase("playing"); canvasRef.current?.focus({ preventScroll: true }); }
  }, []);
  const toggleSound = () => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSound(next);
    if (next) tone([DTMF[4][0], DTMF[4][1]], 0.15);
  };
  // ── Spelmotor ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const g = gRef.current;
    let raf = 0;
    let last = performance.now();
    const burst = (x: number, y: number, color: string, n: number) => {
      const count = reduceMotionRef.current ? Math.ceil(n / 3) : n;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 60 + Math.random() * 200;
        const max = 0.45 + Math.random() * 0.4;
        g.particles.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 60,
          life: max, max, color,
          size: 1.5 + Math.random() * 2.5,
        });
      }
    };
    const float = (x: number, y: number, text: string, color: string) => {
      g.floats.push({ x: clamp(x, 40, W - 40), y, text, color, life: 0.9 });
    };
    const endGame = () => {
      g.phase = "over";
      const isNewBest = g.score > bestRef.current;
      if (isNewBest) {
        bestRef.current = g.score;
        saveBest(g.score);
      }
      setResult({
        score: g.score,
        best: bestRef.current,
        isNewBest,
        maxCombo: g.maxCombo,
        caught: g.caught,
      });
      setPhase("over");
      // Svensk upptagetton, 425 Hz
      tone([425], 0.25, "sine", 0.07);
      window.setTimeout(() => tone([425], 0.25, "sine", 0.07), 350);
      vibrate(200);
    };
    const hurt = (x: number, y: number, label: string, color: string, shake: number) => {
      g.lives -= 1;
      g.combo = 0;
      g.shake = reduceMotionRef.current ? 0 : shake;
      g.flash = 1;
      burst(x, y, color, 22);
      float(x, y - 10, label, color);
      vibrate(60);
      if (g.lives <= 0) endGame();
    };
    const collect = (it: Item) => {
      const mult = () => Math.min(8, 1 + Math.floor(g.combo / 5));
      switch (it.kind) {
        case "call":
        case "vip": {
          g.combo += 1;
          g.maxCombo = Math.max(g.maxCombo, g.combo);
          g.caught += 1;
          const pts = (it.kind === "vip" ? 50 : 10) * mult();
          g.score += pts;
          burst(it.x, it.y, COLORS[it.kind], it.kind === "vip" ? 26 : 14);
          float(it.x, it.y - 18, `+${pts}`, COLORS[it.kind]);
          if (it.kind === "vip") tone([1209, 1477, 1760], 0.2, "triangle", 0.05);
          else tone(DTMF[g.combo % DTMF.length], 0.1);
          const lvl = 1 + Math.floor(g.caught / CATCHES_PER_LEVEL);
          if (lvl > g.level) {
            g.level = lvl;
            g.levelToast = 1.6;
            tone([660, 990], 0.25, "triangle", 0.05);
          }
          break;
        }
        case "spam":
          if (g.shield) {
            g.shield = false;
            burst(it.x, it.y, SHIELD_BLUE, 20);
            float(it.x, it.y - 18, "Blockerat!", SHIELD_BLUE);
            tone([523, 784], 0.18, "triangle", 0.05);
          } else {
            tone([140, 150], 0.3, "sawtooth", 0.07);
            hurt(it.x, it.y, "Spam!", RED, 14);
          }
          break;
        case "shield":
          g.shield = true;
          burst(it.x, it.y, SHIELD_BLUE, 16);
          float(it.x, it.y - 18, "Skydd!", SHIELD_BLUE);
          tone([880, 1320], 0.18, "triangle", 0.05);
          break;
        case "slow":
          g.slow = 6;
          burst(it.x, it.y, PURPLE, 16);
          float(it.x, it.y - 18, "Slow-mo!", PURPLE);
          tone([440, 330], 0.25, "triangle", 0.05);
          break;
        case "magnet":
          g.magnet = 7;
          burst(it.x, it.y, ORANGE, 16);
          float(it.x, it.y - 18, "Magnet!", ORANGE);
          tone([587, 880], 0.18, "triangle", 0.05);
          break;
      }
    };
    const step = (dt: number) => {
      if (g.phase === "paused") return;
      g.time += dt;
      g.shake = Math.max(0, g.shake - 50 * dt);
      g.flash = Math.max(0, g.flash - 2.2 * dt);
      g.levelToast = Math.max(0, g.levelToast - dt);
      const starBoost = g.phase === "playing" ? 1 + g.level * 0.12 : 0.5;
      for (const s of g.stars) {
        s.y += s.v * dt * starBoost;
        if (s.y > H) { s.y = -2; s.x = Math.random() * W; }
      }
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.life -= dt;
        if (p.life <= 0) { g.particles.splice(i, 1); continue; }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 260 * dt;
      }
      for (let i = g.floats.length - 1; i >= 0; i--) {
        const f = g.floats[i];
        f.life -= dt;
        if (f.life <= 0) { g.floats.splice(i, 1); continue; }
        f.y -= 40 * dt;
      }
      // Headsetet följer pekaren även på start-/slutskärmen
      g.px += (g.target - g.px) * Math.min(1, 16 * dt);
      if (g.phase !== "playing") return;
      // Tangentbord
      const dir = (g.keys.right ? 1 : 0) - (g.keys.left ? 1 : 0);
      if (dir) g.target = clamp(g.target + dir * 620 * dt, PADDLE_W / 2, W - PADDLE_W / 2);
      g.slow = Math.max(0, g.slow - dt);
      g.magnet = Math.max(0, g.magnet - dt);
      const ts = g.slow > 0 ? 0.55 : 1;
      // Spawn
      g.spawnTimer -= dt * ts;
      if (g.spawnTimer <= 0) {
        const interval = Math.max(0.3, 0.85 - g.level * 0.05) * (0.75 + Math.random() * 0.5);
        g.spawnTimer += interval;
        const kind = pickKind(g.level);
        const r = kind === "vip" ? 16 : 15;
        g.items.push({
          x: r + 10 + Math.random() * (W - 2 * r - 20),
          y: -r,
          r,
          vy: Math.min(520, 150 + g.level * 20 + Math.random() * 40),
          kind,
          spin: Math.random() * Math.PI * 2,
        });
      }
      // Föremål
      for (let i = g.items.length - 1; i >= 0; i--) {
        const it = g.items[i];
        it.y += it.vy * ts * dt;
        it.spin += dt * 3;
        if (g.magnet > 0 && (it.kind === "call" || it.kind === "vip") && it.y > 60) {
          it.x += (g.px - it.x) * Math.min(1, 2.6 * dt);
        }
        const caught =
          it.y + it.r >= PADDLE_Y &&
          it.y - it.r <= PADDLE_Y + PADDLE_H &&
          Math.abs(it.x - g.px) <= PADDLE_W / 2 + it.r * 0.6;
        if (caught) {
          g.items.splice(i, 1);
          collect(it);
          if (g.phase !== "playing") return;
        } else if (it.y - it.r > H) {
          g.items.splice(i, 1);
          if (it.kind === "call") {
            tone([300, 220], 0.2, "square", 0.04);
            hurt(it.x, H - 80, "Missat samtal", ORANGE, 6);
            if (g.phase !== "playing") return;
          }
        }
      }
    };
    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (g.shake > 0) {
        ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
      }
      // Bakgrund
      ctx.fillStyle = "#070a0f";
      ctx.fillRect(-20, -20, W + 40, H + 40);
      const glow = ctx.createRadialGradient(W / 2, H, 20, W / 2, H, 360);
      glow.addColorStop(0, "rgba(11,114,254,0.22)");
      glow.addColorStop(1, "rgba(11,114,254,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      // Rörligt rutnät
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let y = (g.time * 30) % 64; y < H; y += 64) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      for (let x = 0; x <= W; x += 60) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      ctx.stroke();
      // Stjärnor
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      for (const s of g.stars) ctx.fillRect(s.x, s.y, s.s, s.s);
      // Föremål
      for (const it of g.items) drawItem(ctx, it, g.time);
      // Headset
      ctx.save();
      ctx.shadowColor = CYAN;
      ctx.shadowBlur = 22;
      const grad = ctx.createLinearGradient(g.px - PADDLE_W / 2, 0, g.px + PADDLE_W / 2, 0);
      grad.addColorStop(0, BLUE);
      grad.addColorStop(1, TEAL);
      ctx.fillStyle = grad;
      rr(ctx, g.px - PADDLE_W / 2, PADDLE_Y, PADDLE_W, PADDLE_H, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(g.px, PADDLE_Y + PADDLE_H, 24, Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
      if (g.shield) {
        ctx.strokeStyle = SHIELD_BLUE;
        ctx.globalAlpha = 0.55 + Math.sin(g.time * 8) * 0.25;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(g.px, PADDLE_Y + 7, PADDLE_W / 2 + 14, 28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
      // Partiklar
      for (const p of g.particles) {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Flytande text
      ctx.font = "700 16px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      for (const f of g.floats) {
        ctx.globalAlpha = Math.min(1, f.life * 1.6);
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
      // Röd blixt vid träff
      if (g.flash > 0) {
        ctx.fillStyle = `rgba(255,77,94,${g.flash * 0.22})`;
        ctx.fillRect(0, 0, W, H);
      }
      // ── HUD ──
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("POÄNG", 16, 22);
      ctx.fillStyle = "#fff";
      ctx.font = "700 28px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(String(g.score), 16, 50);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "500 11px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText(`Rekord ${Math.max(bestRef.current, g.score)}`, 16, 68);
      // Liv
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
      ctx.fillText("LINJER", W - 16, 22);
      for (let i = 0; i < START_LIVES; i++) {
        const cx = W - 22 - i * 20;
        ctx.beginPath();
        ctx.arc(cx, 38, 7, 0, Math.PI * 2);
        if (i < g.lives) {
          ctx.fillStyle = TEAL;
          ctx.shadowColor = TEAL;
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
      // Kombo + nivå
      ctx.textAlign = "center";
      if (g.phase === "playing" || g.phase === "paused") {
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(`NIVÅ ${g.level}`, W / 2, 22);
        if (g.combo >= 2) {
          const mult = Math.min(8, 1 + Math.floor(g.combo / 5));
          ctx.fillStyle = mult > 1 ? GOLD : "#fff";
          ctx.font = "700 18px ui-sans-serif, system-ui, sans-serif";
          ctx.fillText(`${g.combo} i rad${mult > 1 ? ` · ×${mult}` : ""}`, W / 2, 46);
        }
      }
      // Power-up-staplar
      ctx.textAlign = "left";
      const bars: { label: string; frac: number; color: string }[] = [];
      if (g.shield) bars.push({ label: "Skydd", frac: 1, color: SHIELD_BLUE });
      if (g.slow > 0) bars.push({ label: "Slow-mo", frac: g.slow / 6, color: PURPLE });
      if (g.magnet > 0) bars.push({ label: "Magnet", frac: g.magnet / 7, color: ORANGE });
      bars.forEach((b, i) => {
        const y = 92 + i * 16;
        ctx.fillStyle = b.color;
        ctx.font = "600 10px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(b.label, 16, y + 6);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        rr(ctx, 70, y, 70, 6, 3);
        ctx.fill();
        ctx.fillStyle = b.color;
        rr(ctx, 70, y, Math.max(4, 70 * b.frac), 6, 3);
        ctx.fill();
      });
      // Nivå-toast
      if (g.levelToast > 0) {
        ctx.globalAlpha = Math.min(1, g.levelToast);
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 24;
        ctx.font = "800 38px ui-sans-serif, system-ui, sans-serif";
        ctx.fillText(`NIVÅ ${g.level}`, W / 2, H * 0.38);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    };
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [tone]);
  // ── Tangentbord ──
  useEffect(() => {
    const isInteractive = (t: EventTarget | null) => {
      return t instanceof HTMLElement && Boolean(t.closest("button, a, input, textarea, select, [contenteditable=true]"));
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || isInteractive(e.target)) return;
      if (!gameAreaRef.current?.contains(document.activeElement)) return;
      const g = gRef.current;
      const k = e.key.toLowerCase();
      if (k === "arrowleft" || k === "a") g.keys.left = true;
      else if (k === "arrowright" || k === "d") g.keys.right = true;
      else if ((k === " " || k === "p") && !isInteractive(e.target)) {
        if (g.phase === "playing" || g.phase === "paused") { e.preventDefault(); togglePause(); }
        else if (k === " " && (g.phase === "idle" || g.phase === "over")) { e.preventDefault(); start(); }
      } else if (k === "enter" && !isInteractive(e.target)) {
        if (g.phase === "idle" || g.phase === "over") start();
        else if (g.phase === "paused") togglePause();
      }
      if ((g.phase === "playing" || g.phase === "paused") && ["arrowleft", "arrowright"].includes(k)) {
        e.preventDefault();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const g = gRef.current;
      if (k === "arrowleft" || k === "a") g.keys.left = false;
      else if (k === "arrowright" || k === "d") g.keys.right = false;
    };
    const autoPause = () => {
      gRef.current.keys = { left: false, right: false };
      if (gRef.current.phase === "playing") togglePause();
    };
    const onVisibility = () => { if (document.hidden) autoPause(); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", autoPause);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", autoPause);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [start, togglePause]);
  useEffect(() => () => { void audioRef.current?.close(); }, []);
  // ── Pekare (mus + touch) ──
  function movePointer(clientX: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    gRef.current.target = clamp(x, PADDLE_W / 2, W - PADDLE_W / 2);
  }
  return (
    <div ref={gameAreaRef} className="mx-auto w-full max-w-[420px] text-white" onBlur={e => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        gRef.current.keys = { left: false, right: false };
        if (gRef.current.phase === "playing") togglePause();
      }
    }}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 shadow-2xl shadow-[#0B72FE]/10">
            <canvas
              ref={canvasRef}
              tabIndex={0}
              aria-describedby="game-help"
              aria-label="Minispel: fånga samtalen och undvik spam"
              className="block h-auto w-full touch-none select-none"
              style={{ aspectRatio: `${W} / ${H}`, cursor: phase === "playing" ? "none" : "default" }}
              onPointerMove={e => movePointer(e.clientX)}
              onPointerDown={e => {
                e.currentTarget.focus();
                (e.currentTarget as HTMLCanvasElement).setPointerCapture(e.pointerId);
                movePointer(e.clientX);
              }}
            />
            {/* Overlay: start / paus / game over */}
            {phase !== "playing" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050607]/80 px-6 text-center backdrop-blur-sm">
                {phase === "idle" && (
                  <>
                    <h2 className="text-3xl font-semibold tracking-tight">Fånga samtalen</h2>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      Flytta headsetet med musen, fingret eller ← →.
                      <br />
                      Fånga samtal, undvik spam, bygg kombo.
                    </p>
                    <ul className="mt-5 grid w-full grid-cols-2 gap-x-4 gap-y-2.5 text-left text-xs">
                      {LEGEND.map(item => (
                        <li key={item.label} className="flex items-start gap-2">
                          <span
                            className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                          />
                          <span>
                            <strong className="font-semibold text-white">{item.label}</strong>
                            <br />
                            <span className="text-white/55">{item.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={start}
                      className="
                        mt-7 inline-flex min-h-[52px] items-center justify-center gap-2
                        rounded-full bg-gradient-to-r from-[#0B72FE] via-[#12B4F0] to-[#2CCEC2]
                        px-7 text-sm font-semibold text-white
                        shadow-[0_18px_46px_rgba(11,114,254,0.3)]
                        transition-all duration-300 hover:-translate-y-0.5
                      "
                    >
                      <Play size={16} strokeWidth={2} /> Starta
                    </button>
                    {bestRef.current > 0 && (
                      <p className="mt-3 text-xs text-white/50">Ditt rekord: {bestRef.current}</p>
                    )}
                  </>
                )}
                {phase === "paused" && (
                  <>
                    <h2 className="text-3xl font-semibold tracking-tight">Pausat</h2>
                    <p className="mt-2 text-sm text-white/70">Kunderna kan vänta. Lite.</p>
                    <button
                      type="button"
                      onClick={togglePause}
                      className="
                        mt-6 inline-flex min-h-[52px] items-center justify-center gap-2
                        rounded-full bg-gradient-to-r from-[#0B72FE] to-[#2CCEC2]
                        px-7 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5
                      "
                    >
                      <Play size={16} strokeWidth={2} /> Fortsätt
                    </button>
                  </>
                )}
                {phase === "over" && (
                  <>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#FF4D5E]">
                      Linjen gick ned
                    </p>
                    <p className="mt-2 text-6xl font-semibold tracking-tight">{result.score}</p>
                    {result.isNewBest ? (
                      <p className="mt-1 text-sm font-semibold text-[#FFC83D]">Nytt rekord!</p>
                    ) : (
                      <p className="mt-1 text-sm text-white/50">Rekord: {result.best}</p>
                    )}
                    <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/80">{verdict(result.score)}</p>
                    <p className="mt-3 text-xs text-white/50">
                      {result.caught} samtal fångade · längsta kombo {result.maxCombo}
                    </p>
                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                      <button
                        type="button"
                        onClick={start}
                        className="
                          inline-flex min-h-[48px] items-center justify-center gap-2
                          rounded-full bg-gradient-to-r from-[#0B72FE] to-[#2CCEC2]
                          px-6 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5
                        "
                      >
                        <RotateCcw size={15} strokeWidth={2} /> Spela igen
                      </button>
                      <a
                        href="#ansokan"
                        className="
                          inline-flex min-h-[48px] items-center justify-center
                          rounded-full border border-white/20 bg-white/[0.06] px-6
                          text-sm font-medium text-white transition-all duration-300
                          hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.10]
                        "
                      >
                        Hör av dig
                      </a>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {/* Verktygsrad */}
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-white/50">
            <span>← → / A D · Space = paus</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={togglePause}
                disabled={phase !== "playing" && phase !== "paused"}
                aria-label={phase === "paused" ? "Fortsätt" : "Pausa"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {phase === "paused" ? <Play size={15} /> : <Pause size={15} />}
              </button>
              <button
                type="button"
                onClick={toggleSound}
                aria-label={sound ? "Stäng av ljud" : "Slå på ljud"}
                aria-pressed={sound}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
            </div>
          </div>
    </div>
  );
}
const values = [
  { number: "01", title: "Människor först.", text: "Bakom varje samtal, lösning och fråga finns en människa. Vi vill göra hennes arbetsdag enklare." },
  { number: "02", title: "Nyfikenhet framåt.", text: "Gillar du att förstå hur saker fungerar, ställa en fråga till och hitta en bättre väg? Då har vi något gemensamt." },
  { number: "03", title: "Bättre tillsammans.", text: "Bra lösningar börjar med att lyssna. På kunden, på varandra och på den som ser saken från ett annat håll." },
];
const MAX_CV_SIZE = 3 * 1024 * 1024;

function validateCV(file: File): string | null {
  if (file.size === 0 || file.size > MAX_CV_SIZE) {
    return "Välj en fil som inte är tom och är högst 3 MB.";
  }
  if (file.name.length > 200 || !/^[^/\\\r\n]+\.(pdf|docx)$/i.test(file.name)) {
    return "Välj en PDF- eller DOCX-fil med ett filnamn på högst 200 tecken.";
  }
  return null;
}

function cvToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string" || !result.includes(",")) {
        reject(new Error("CV:t kunde inte läsas. Välj filen igen."));
        return;
      }
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(new Error("CV:t kunde inte läsas."));
    reader.onabort = () => reject(new Error("Inläsningen av CV:t avbröts."));
    reader.readAsDataURL(file);
  });
}

type SubmitState = "idle" | "sending" | "success" | "error";
function ApplicationForm({ endpoint }: { endpoint: string }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const requestRef = useRef<{ body: string; id: string } | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const field = "mt-2 min-h-12 w-full rounded-xl border border-[#D6DDE5] bg-white px-4 py-3 text-base text-[#171C25] outline-none transition placeholder:text-[#8B94A2] focus:border-[#2CCEC2] focus:ring-2 focus:ring-[#2CCEC2]/25 disabled:opacity-50";
  useEffect(() => {
    if (state === "success") feedbackRef.current?.focus();
  }, [state]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busyRef.current) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const cv = uploadRef.current?.files?.[0];
    const cvError = cv ? validateCV(cv) : null;
    if (cvError) {
      setError(cvError);
      setState("error");
      return;
    }

    const payload = Object.fromEntries(
      ["name", "email", "phone", "role", "message", "website"].map(
        key => [key, String(data.get(key) || "").trim()],
      ),
    );
    if (!payload.name || payload.message.length < 20) {
      setError("Fyll i ditt namn och berätta om dig själv med minst 20 tecken.");
      setState("error");
      return;
    }

    busyRef.current = true;
    setState("sending");
    setError("");
    try {
      const attachment = cv
        ? { filename: cv.name, content: await cvToBase64(cv) }
        : undefined;
      const body = JSON.stringify({ ...payload, attachment });

      // Samma innehåll återanvänder nyckeln vid ett nytt försök.
      if (!requestRef.current || requestRef.current.body !== body) {
        requestRef.current = { body, id: crypto.randomUUID() };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": requestRef.current.id,
        },
        body,
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        const fallback = response.status === 413
          ? "CV:t är för stort. Välj en fil på högst 3 MB."
          : "Ansökan kunde inte skickas. Försök igen om en stund.";
        throw new Error(typeof result?.error === "string" ? result.error : fallback);
      }
      form.reset();
      uploadRef.current?.setCustomValidity("");
      setFileName("");
      requestRef.current = null;
      setState("success");
    } catch (cause) {
      const timedOut = cause instanceof Error &&
        (cause.name === "TimeoutError" || cause.name === "AbortError");
      setError(timedOut
        ? "Anslutningen tog för lång tid. Dina uppgifter finns kvar, så du kan försöka igen."
        : cause instanceof Error ? cause.message : "Ansökan kunde inte skickas. Försök igen.");
      setState("error");
    } finally {
      busyRef.current = false;
    }
  }

  return (
    <div className="rounded-2xl border border-[#DFE4EB] bg-white p-6 sm:p-8">
      {state === "success" ? (
        <div ref={feedbackRef} tabIndex={-1} role="status" className="py-14 outline-none">
          <CheckCircle2 aria-hidden="true" className="size-11 text-[#087B72]" />
          <h3 className="mt-6 text-3xl font-medium tracking-tight">Tack för ditt hej!</h3>
          <p className="mt-4 text-sm leading-7 text-[#59616D]">Din ansökan har skickats. Vi ser fram emot att läsa mer om dig.</p>
          <button type="button" onClick={() => setState("idle")} className="mt-7 rounded-full border border-[#D6DDE5] px-5 py-3 text-sm transition hover:bg-[#F0F4F8]">Skicka en ny ansökan</button>
        </div>
      ) : (
        <form onSubmit={submit} aria-labelledby="application-form-title" aria-describedby="application-privacy" aria-busy={state === "sending"}>
          <h3 id="application-form-title" className="text-2xl font-medium tracking-tight">Ditt nästa steg börjar här.</h3>
          <p className="mt-2 text-sm leading-6 text-[#67717F]">Fält markerade med * behöver fyllas i.</p>
          <fieldset disabled={state === "sending"} className="mt-7 min-w-0 space-y-5 border-0 p-0">
            <legend className="sr-only">Dina uppgifter och ansökan</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium" htmlFor="application-name">Namn *<input id="application-name" name="name" autoComplete="name" required maxLength={120} pattern={String.raw`.*\S.*`} className={field} placeholder="För- och efternamn" /></label>
              <label className="block text-sm font-medium" htmlFor="application-email">Mejladress *<input id="application-email" name="email" type="email" autoComplete="email" required maxLength={254} className={field} placeholder="du@exempel.se" /></label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium" htmlFor="application-phone">Telefon<input id="application-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={field} placeholder="070-123 45 67" /></label>
              <label className="block text-sm font-medium" htmlFor="application-role">Vad vill du jobba med? *<select id="application-role" name="role" required defaultValue="" className={field}><option value="" disabled>Välj ett område</option><option value="Försäljning">Försäljning</option><option value="Teknik och support">Teknik och support</option><option value="Kundrelationer">Kundrelationer</option><option value="Annat / spontanansökan">Annat / spontanansökan</option></select></label>
            </div>
            <div>
              <label className="block text-sm font-medium" htmlFor="application-cv">Ladda upp ditt CV</label>
              <div className="mt-2 rounded-xl border border-dashed border-[#C8D3E1] bg-[#F8FAFC] p-5 transition focus-within:border-[#0B72FE] focus-within:ring-2 focus-within:ring-[#0B72FE]/15">
                <input ref={uploadRef} id="application-cv" name="cv" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-describedby="cv-help cv-selection" onChange={event => {
                  const input = event.currentTarget;
                  const file = input.files?.[0];
                  const invalid = file ? validateCV(file) : null;
                  input.setCustomValidity(invalid || "");
                  setFileName(file?.name || "");
                  if (invalid) {
                    setError(input.validationMessage);
                    setState("error");
                  } else {
                    setError("");
                    setState("idle");
                  }
                }} className="block w-full min-w-0 text-sm text-[#59616D] file:mr-4 file:rounded-full file:border-0 file:bg-[#E7EFFB] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-[#0B72FE] hover:file:bg-[#D9E8FC]" />
                <p id="cv-help" className="mt-3 text-xs leading-6 text-[#67717F]">Valfritt. PDF eller DOCX, högst 3 MB. CV:t bifogas till din ansökan.</p>
                <div id="cv-selection" aria-live="polite" className="mt-2 flex min-w-0 items-center gap-3">
                  {fileName && <><span className="min-w-0 break-all text-xs text-[#414B59]">Vald fil: {fileName}</span><button type="button" className="shrink-0 rounded px-2 py-1 text-xs font-medium text-[#0B72FE] hover:bg-[#E7EFFB]" onClick={() => {
                    if (uploadRef.current) { uploadRef.current.value = ""; uploadRef.current.setCustomValidity(""); }
                    setFileName(""); setError(""); setState("idle");
                  }}>Ta bort</button></>}
                </div>
              </div>
            </div>
            <label className="block text-sm font-medium" htmlFor="application-message">Berätta lite om dig själv *<textarea id="application-message" name="message" required minLength={20} maxLength={5000} rows={5} className={`${field} resize-y`} placeholder="Vad gör du idag, vad vill du göra framåt och varför är du nyfiken på Compartners?" /></label>
            <div aria-hidden="true" className="hidden"><label htmlFor="application-website">Lämna tomt<input id="application-website" name="website" tabIndex={-1} autoComplete="off" /></label></div>
          </fieldset>
          <p id="application-privacy" className="mt-5 text-xs leading-6 text-[#67717F]">Uppgifterna skickas till Compartners för att vi ska kunna hantera din ansökan och kontakta dig om jobb. Ta bara med uppgifter som är relevanta för din ansökan.</p>
          {state === "error" && <p role="alert" className="mt-5 rounded-xl border border-[#FF4D5E]/30 bg-[#FFF1F2] p-4 text-sm leading-6 text-[#A8293E]">{error}</p>}
          <button type="submit" disabled={state === "sending"} className="mt-6 inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-full bg-[#0B72FE] px-6 text-sm font-semibold text-white transition hover:bg-[#095BCB] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2CCEC2]">
            {state === "sending" ? <><LoaderCircle aria-hidden="true" size={18} className="animate-spin motion-reduce:animate-none" /> Skickar din ansökan…</> : <>Skicka ansökan <Send aria-hidden="true" size={17} /></>}
          </button>
        </form>
      )}
    </div>
  );
}
/** Lägg sidan i er befintliga layout med navigation och footer. */
export default function JobbaHosOss({ applicationEndpoint = "/api/job-application" }: { applicationEndpoint?: string }) {
  return (
    <main className="min-h-screen bg-white text-[#171C25] [color-scheme:light]">
        <Navbar />
      <section aria-labelledby="careers-title" className="relative overflow-hidden px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-44 bg-[#18191d]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-0 size-[520px] rounded-full bg-[#12B4F0]/10 blur-[110px]" />
        <div className="relative mx-auto max-w-[1240px]">
              <h1 id="careers-title" className="mt-6 max-w-[960px] text-5xl font-medium text-white leading-[1.02] tracking-[-0.055em] md:text-7xl lg:text-[96px]">
            Bra kontakt börjar<br />med <span className="text-gray-400">bra människor.</span>
          </h1>
          <div className="mt-8 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <p className="max-w-[550px] text-lg leading-8 text-[#acadae]">Teknik är vår vardag. Människor är anledningen. Vill du vara med och göra det enklare för företag att kommunicera och arbeta?</p>
<a
              href="#culture"
              className="
                group inline-flex min-h-[52px] items-center justify-center gap-2
                rounded-full
                bg-white
                px-6
                text-sm font-semibold text-black
                shadow-[0_18px_46px_rgba(11,114,254,0.24)]
                transition-all duration-300
                hover:-translate-y-0.5
              "
            >
              Lär känna oss
              <ArrowDown
                size={16}
                className="transition-transform group-hover:translate-y-1"
              />
            </a>          </div>
        </div>
      </section>
      <section id="culture" aria-labelledby="culture-title" className="bg-white p-3 md:p-5">
        <div className="rounded-lg bg-[#F5F6F8] px-6 py-12 md:px-12 md:py-16">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#67717F]">Det vi tror på</p>
            <h2 id="culture-title" className="mt-4 max-w-[650px] text-3xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">Lite mindre krångel.<br />Lite mer tillsammans.</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
              {values.map(value => (
                <article key={value.number} className="border-t border-[#D6DDE5] pt-5">
                  <span className="text-xs font-semibold text-[#0B72FE]">{value.number}</span>
                  <h3 className="mt-6 text-2xl font-medium tracking-tight">{value.title}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-[#59616D]">{value.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="game-title" className="bg-white p-3 md:p-5">
        <div className="relative isolate overflow-hidden rounded-lg bg-[#F5F6F8] px-6 py-12 text-[#171C25] md:px-12 md:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-20 -z-10 size-[560px] rounded-full bg-[#0B72FE]/15 blur-[120px]" />
          <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
            <div>
              <h2 id="game-title" className="mt-7 text-4xl font-medium leading-[1.05] tracking-[-0.05em] md:text-6xl">Kan du hålla<br /><span className="text-[#087B72]">linjen uppe?</span></h2>
              <p className="mt-6 max-w-[440px] text-base leading-8 text-[#59616D]">Fånga samtalen, undvik spam och håll huvudet kallt när tempot ökar. Vår lilla hyllning till bra kommunikation.</p>
              <p className="mt-4 max-w-[440px] text-sm leading-7 text-[#67717F]">Det här är bara för skojs skull. Du behöver inga spelpoäng för att höra av dig till oss.</p>
              <div className="mt-9 grid max-w-[420px] grid-cols-3 gap-4 border-t border-[#DFE4EB] pt-6">
                {[['01', 'Fånga samtal'], ['02', 'Undvik spam'], ['03', 'Slå ditt rekord']].map(([n, label]) => <div key={n}><p className="text-xs text-[#087B72]">{n}</p><p className="mt-2 text-sm text-[#414B59]">{label}</p></div>)}
              </div>
              <p id="game-help" className="mt-8 text-xs leading-6 text-[#67717F]">Styr med mus, finger eller piltangenter. Klicka på spelplanen för tangentbordsstyrning. Mellanslag pausar. Ljudet är av tills du slår på det.</p>
            </div>
            <CareersGame />
          </div>
        </div>
      </section>
      <section id="ansokan" aria-labelledby="apply-title" className="scroll-mt-24 bg-white p-3 md:p-5">
        <div className="rounded-lg bg-[#F5F6F8] px-6 py-12 md:px-12 md:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.8fr_1fr] lg:gap-24">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0B72FE]">Spontanansökan</p>
              <h2 id="apply-title" className="mt-4 text-4xl font-medium leading-[1.08] tracking-[-0.045em] md:text-5xl">Vi börjar med<br />ett hej.</h2>
              <p className="mt-6 max-w-[490px] text-base leading-8 text-[#59616D]">Berätta vem du är, vad du gillar att göra och vad du skulle vilja bidra med hos Compartners. Kanske börjar vår nästa bra kontakt med dig.</p>
              <p className="mt-7 max-w-[430px] border-t border-[#DFE4EB] pt-6 text-sm leading-7 text-[#67717F]">Du behöver inte ha alla svar redan nu. Berätta vad du är nyfiken på, så börjar vi där.</p>
            </div>
            <ApplicationForm endpoint={applicationEndpoint} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
