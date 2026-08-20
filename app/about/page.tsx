import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — Bryan",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-14 sm:py-20">
      {/* Intro: text left, photo right — mirrors the home page's hero rhythm */}
      <div className="grid gap-12 sm:grid-cols-[1.3fr_1fr] sm:items-start">
        <div>
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl leading-[1.02] text-ink-100 tracking-tight">
            Hey, I&apos;m Bryan.
          </h1>

          <p className="mt-6 text-ink-300 text-base leading-relaxed">
            I&apos;m a developer working across the web and systems layer, with
            a growing interest in security. Most of what I build starts as a
            personal itch: a tool I wanted, a game I wanted to remaster, a habit
            I wanted to track. I like projects small enough to finish and
            interesting enough to keep tinkering with after they&apos;re
            &quot;done.&quot;
          </p>

          <p className="mt-4 text-ink-300 text-base leading-relaxed">
            Outside of shipping projects, I compete in CTF competitions:
            forensics, crypto, and misc challenges that reward reading carefully
            and trying the obvious thing before the clever one. That same
            instinct shows up in how I build: start simple, make it work, then
            make it good.
          </p>
        </div>

        {/* Photo card — same border/radius language as the project cards */}
        <div className="relative aspect-[4/5] w-full max-w-sm mx-auto sm:mx-0 rounded-2xl border border-edge overflow-hidden">
          <Image
            src="/images/profile.png"
            alt="Bryan"
            fill
            sizes="(min-width: 640px) 20rem, 80vw"
            className="object-cover grayscale-[15%] contrast-[1.05]"
            priority
          />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}
