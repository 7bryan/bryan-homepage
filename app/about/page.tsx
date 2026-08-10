import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Bryan",
};

const timeline = [
  {
    period: "Now",
    text: "Building DevPulse and other web/systems projects, competing in CTFs on the side.",
  },
  {
    period: "Recently",
    text: "Shipped a web remaster of an earlier Pygame chess engine, and Caelum, a NASA APOD explorer.",
  },
  {
    period: "Ongoing",
    text: "Learning by taking things apart — CTF forensics, crypto, and reverse engineering challenges.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-14 sm:py-20">
      <p className="font-mono text-xs text-accent-green mb-3">
        $ cat about.md
      </p>

      <div className="rounded-lg border border-edge bg-elevated p-6 sm:p-10">
        <h1 className="font-mono text-2xl sm:text-3xl text-ink-100 tracking-tight mb-6">
          # about
        </h1>

        <p className="text-ink-300 text-sm sm:text-base leading-relaxed">
          I'm Bryan — a developer working across the web and systems layer,
          with a growing interest in security. Most of what I build starts as
          a personal itch: a tool I wanted, a game I wanted to remaster, a
          habit I wanted to track. I like projects small enough to finish and
          interesting enough to keep tinkering with after they're "done."
        </p>

        <p className="text-ink-300 text-sm sm:text-base leading-relaxed mt-4">
          Outside of shipping projects, I compete in CTF competitions —
          forensics, crypto, and misc challenges that reward reading
          carefully and trying the obvious thing before the clever one. That
          same instinct shows up in how I build: start simple, make it work,
          then make it good.
        </p>

        <h2 className="font-mono text-lg text-ink-100 mt-10 mb-4">
          ## timeline
        </h2>
        <ul className="space-y-4">
          {timeline.map((t) => (
            <li key={t.period} className="flex gap-4">
              <span className="font-mono text-xs text-accent-amber shrink-0 w-20 pt-0.5">
                {t.period}
              </span>
              <span className="text-sm text-ink-300 leading-relaxed">
                {t.text}
              </span>
            </li>
          ))}
        </ul>

        <h2 className="font-mono text-lg text-ink-100 mt-10 mb-4">
          ## toolbox
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          Neovim (LazyVim) on a daily driver, Python and Go for backend and
          systems work, FastAPI and Flask for services, vanilla JS/TS on the
          frontend when a framework would be overkill, Next.js when it
          wouldn't.
        </p>
      </div>
    </div>
  );
}
