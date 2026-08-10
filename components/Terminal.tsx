"use client";

import { useEffect, useState } from "react";

type Line = { prompt?: string; text: string; color?: string };

const lines: Line[] = [
  { prompt: "$", text: "whoami" },
  { text: "bryan — full-stack & systems developer", color: "text-ink-100" },
  { prompt: "$", text: "cat focus.txt" },
  {
    text: "web development · systems programming · security · CTF",
    color: "text-accent-blue",
  },
  { prompt: "$", text: "./intro.sh" },
  {
    text: "I build things that work, take apart things that shouldn't, and write down what I learn.",
    color: "text-ink-300",
  },
];

export default function Terminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (visibleLines >= lines.length) {
      setDone(true);
      return;
    }
    const current = lines[visibleLines];
    const fullText = (current.prompt ? current.prompt + " " : "") + current.text;

    if (charCount < fullText.length) {
      const speed = current.prompt ? 28 : 10;
      const t = setTimeout(() => setCharCount((c) => c + 1), speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((v) => v + 1);
        setCharCount(0);
      }, 220);
      return () => clearTimeout(t);
    }
  }, [charCount, visibleLines]);

  return (
    <div className="w-full rounded-lg border border-edge bg-elevated shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_-20px_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-edge bg-overlay/60">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-red/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-amber/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent-green/70" />
        <span className="ml-3 font-mono text-xs text-ink-700">
          bryan@portfolio: ~
        </span>
      </div>
      <div className="p-5 sm:p-6 font-mono text-[13px] sm:text-sm leading-relaxed min-h-[220px]">
        {lines.slice(0, visibleLines).map((l, i) => (
          <div key={i} className={l.color ?? "text-ink-300"}>
            {l.prompt && <span className="text-accent-green">{l.prompt} </span>}
            {l.text}
          </div>
        ))}
        {visibleLines < lines.length &&
          (() => {
            const current = lines[visibleLines];
            const prefix = current.prompt ? current.prompt + " " : "";
            const typed = (prefix + current.text).slice(0, charCount);
            const promptPart = typed.slice(0, prefix.length);
            const textPart = typed.slice(prefix.length);
            return (
              <div className={current.color ?? "text-ink-300"}>
                {promptPart && (
                  <span className="text-accent-green">{promptPart}</span>
                )}
                {textPart}
                <span className="inline-block w-2 h-4 -mb-0.5 bg-ink-300 animate-blink ml-0.5" />
              </div>
            );
          })()}
        {done && (
          <div className="text-ink-300">
            <span className="text-accent-green">$ </span>
            <span className="inline-block w-2 h-4 -mb-0.5 bg-ink-300 animate-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
