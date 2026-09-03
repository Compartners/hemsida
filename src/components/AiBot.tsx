"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const QUICK_PROMPTS = [
  "Vilka växelplattformar har ni?",
  "Hur fungerar era körjournaler?",
  "Jag vill bli kontaktad för en offert",
];

// Inbyggd kunskapsbas för lokala svar
const KNOWLEDGE_BASE: { keywords: string[]; response: string }[] = [
  {
    keywords: ["växel", "växlar", "plattform", "mobil växel"],
    response:
      "Vi är operatörsoberoende och arbetar med ledande växelplattformar (bland annat Lynes, Telia och Tele2). Det gör att vi kan skräddarsy en lösning som passar exakt er bolagsstorlek och era arbetsflöden.",
  },
  {
    keywords: ["körjournal", "körjournaler", "bil", "skatteverket"],
    response:
      "Våra elektroniska körjournaler installeras enkelt i fordonen och registrerar alla resor automatiskt via GPS. De uppfyller alla krav från Skatteverket så att ni slipper manuell administration.",
  },
  {
    keywords: ["offert", "kontakt", "boka", "möte", "pris"],
    response:
      "Vad roligt! Lämna gärna ditt telefonnummer eller din e-postadress här i chatten, så ser vi till att en av våra rådgivare ringer upp dig inom kort.",
  },
  {
    keywords: ["support", "hjälp", "problem", "öppettider"],
    response:
      "Vår personliga support finns alltid nära till hands. Som kund har ni en dedikerad kontaktperson så att ni slipper sitta i långa telefonköer.",
  },
];

function getBotReply(userText: string): string {
  const lower = userText.toLowerCase();
  const matched = KNOWLEDGE_BASE.find((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  );

  return (
    matched?.response ??
    "Tack för ditt meddelande! Vi på Compartners hjälper företag med helhetslösningar inom telefoni, IT och körjournaler. Vill du att vi kontaktar dig med mer specifik information?"
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hej! Jag är Compartners AI-assistent. Hur kan jag hjälpa er med telefoni, växlar eller IT idag?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scrolla vid nya meddelanden
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Rensa timers vid unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const simulateStreamingResponse = (fullText: string) => {
    setIsLoading(true);

    const botMessageId = Date.now().toString();

    // Skapa ett tomt assistent-meddelande
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, role: "assistant", content: "" },
    ]);

    let currentIndex = 0;
    const chunkSize = 3; // Antal tecken per tick för jämn streaming

    typingTimerRef.current = setInterval(() => {
      currentIndex += chunkSize;
      const currentChunk = fullText.slice(0, currentIndex);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, content: currentChunk } : msg
        )
      );

      if (currentIndex >= fullText.length) {
        if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        setIsLoading(false);
      }
    }, 25);
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botResponseText = getBotReply(text);

    // Liten initial tänk-fördröjning innan streaming börjar
    setTimeout(() => {
      simulateStreamingResponse(botResponseText);
    }, 400);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-4 w-[360px] sm:w-[420px] h-[550px] max-h-[82vh] flex flex-col rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-muted/50 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    Compartner AI
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Svarar direkt</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Stäng chatt"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meddelandeström */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted/80 text-foreground border border-border/50 rounded-bl-none"
                    }`}
                  >
                    {m.content}
                  </div>

                  {m.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-2.5 justify-start items-center text-muted-foreground text-xs pl-9">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Skriver svar...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Snabbvals-chips */}
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-border/40 bg-muted/20">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  disabled={isLoading}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-background border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 disabled:opacity-50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Inputfält */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ställ en fråga om telefoni & IT..."
                disabled={isLoading}
                className="flex-1 px-3.5 py-2 text-xs md:text-sm bg-muted/60 border border-border rounded-xl focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                aria-label="Skicka meddelande"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flytande Trigger-knapp */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-shadow"
        aria-label="Öppna AI-chatt"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full animate-pulse" />
        </div>
        <span className="text-xs md:text-sm font-semibold pr-1">Prata med vår AI</span>
      </motion.button>
    </div>
  );
}