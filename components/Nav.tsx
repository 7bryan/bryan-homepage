"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes = [
  { href: "/", label: "home" },
  { href: "/projects", label: "projects" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-edge/80 bg-base/85 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm text-ink-100 hover:text-accent-blue transition-colors"
          onClick={() => setOpen(false)}
        >
          <span className="text-accent-green">~</span>
          <span className="text-ink-700">/</span>bryan
        </Link>

        <nav className="hidden sm:flex items-center gap-1 font-mono text-sm">
          {routes.map((r, i) => {
            const active =
              r.href === "/" ? pathname === "/" : pathname.startsWith(r.href);
            return (
              <span key={r.href} className="flex items-center">
                {i > 0 && <span className="text-ink-700 px-1">/</span>}
                <Link
                  href={r.href}
                  className={`px-2 py-1 rounded transition-colors ${
                    active
                      ? "text-accent-blue bg-elevated"
                      : "text-ink-500 hover:text-ink-100"
                  }`}
                >
                  {r.label}
                </Link>
              </span>
            );
          })}
          <span className="text-ink-700 pl-1 animate-blink">_</span>
        </nav>

        <button
          className="sm:hidden font-mono text-sm text-ink-300 border border-edge rounded px-3 py-1.5"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? "close" : "menu"}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="sm:hidden border-t border-edge bg-base px-5 py-3 flex flex-col gap-1 font-mono text-sm"
        >
          {routes.map((r) => {
            const active =
              r.href === "/" ? pathname === "/" : pathname.startsWith(r.href);
            return (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setOpen(false)}
                className={`px-2 py-2 rounded ${
                  active
                    ? "text-accent-blue bg-elevated"
                    : "text-ink-500 hover:text-ink-100"
                }`}
              >
                /{r.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
