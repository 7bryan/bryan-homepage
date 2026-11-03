"use client";

import { Span } from "next/dist/trace";
import { types } from "node:util";
import { useEffect, useState } from "react";

type Props = {
  phrases: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  holdMs?: number; // pause after fully typed
  startDelay?: number;
};

export default function TypeWriter({
  phrases,
  typeSpeed = 55,
  deleteSpeed = 30,
  holdMs = 1000,
  startDelay = 0,
}: Props) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setText(phrases[0]);
      return;
    }

    const full = phrases[index];
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!deleting) {
      if (text == full) {
        if (phrases.length === 1) return;
        timeout = setTimeout(() => setDeleting(true), holdMs);
      } else {
        timeout = setTimeout(
          () => setText(full.slice(0, text.length + 1)),
          text.length === 0 ? startDelay : typeSpeed,
        );
      }
    } else {
      if (text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        timeout = setTimeout(
          () => setText(full.slice(0, text.length - 1)),
          deleteSpeed,
        );
      }
    }

    return () => clearTimeout(timeout);
  }, [
    text,
    deleting,
    phrases,
    reduceMotion,
    typeSpeed,
    deleteSpeed,
    holdMs,
    startDelay,
  ]);

  return (
    <>
      {/* screen renders a stable sentence */}
      <span className="sr-only">{phrases[0]}</span>
      <span aria-hidden>{text} </span>
      <span
        aria-hidden
        className="inline-block w-[2px] h-5 -mb-1 ml-1 bg-accent animate-blink align-middle"
      />
    </>
  );
}
