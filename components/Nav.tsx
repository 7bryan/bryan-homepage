"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const routes = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 sm:top-6 z-50 px-4 sm:px-0">
      <div className="mx-auto max-w-5xl flex items-center justify-between sm:justify-center">
        <div className="glass flex items-center gap-1 rounded-full px-2 py-2 sm:px-2.5">
          <Link
            href="/"
            className="font-display font-semibold text-sm text-ink-100 px-3 sm:px-4 py-1.5"
          >
            Bryan
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {routes.map((r) => {
              const active =
                r.href === "/" ? pathname === "/" : pathname.startsWith(r.href);
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className={`relative px-4 py-1.5 rounded-full text-sm transition-colors ${
                    active ? "text-ink-100" : "text-ink-500 hover:text-ink-100"
                  }`}
                >
                  {r.label}
                  {active && (
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            className="sm:hidden ml-1 px-3 py-1.5 rounded-full text-sm text-ink-300"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          className="glass sm:hidden mt-3 mx-4 rounded-2xl p-2 flex flex-col gap-1"
        >
          {routes.map((r) => {
            const active =
              r.href === "/" ? pathname === "/" : pathname.startsWith(r.href);
            return (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm ${
                  active ? "text-ink-100" : "text-ink-500 hover:text-ink-100"
                }`}
              >
                {r.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
