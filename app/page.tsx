import Link from "next/link";
import Terminal from "@/components/Terminal";
import { featuredProjects } from "@/lib/projects";

const stack = [
  { dir: "web/", items: ["Next.js", "React", "FastAPI", "Flask"] },
  { dir: "systems/", items: ["Go", "Python", "Linux"] },
  { dir: "security/", items: ["CTF", "reverse eng.", "crypto challenges"] },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8">
      <section className="pt-14 sm:pt-20 pb-16 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="font-mono text-xs text-accent-green mb-3">
            // personal site & portfolio
          </p>
          <h1 className="font-mono text-3xl sm:text-4xl md:text-[2.75rem] leading-tight text-ink-100 tracking-tight">
            Bryan
            <span className="text-ink-700"> — </span>
            <span className="text-accent-blue">builder</span> of small, sharp
            things.
          </h1>
          <p className="mt-5 text-ink-500 text-sm sm:text-base max-w-md leading-relaxed">
            Full-stack and systems development, with a running interest in
            security and CTF work. This site is the log of what I've shipped.
          </p>
          <div className="mt-8 flex items-center gap-3 font-mono text-sm">
            <Link
              href="/projects"
              className="px-4 py-2 rounded border border-accent-blue/40 text-accent-blue hover:bg-accent-blue/10 transition-colors"
            >
              view projects
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded border border-edge text-ink-500 hover:text-ink-100 hover:border-ink-700 transition-colors"
            >
              get in touch
            </Link>
          </div>
        </div>

        <Terminal />
      </section>

      <section className="pb-16">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-mono text-sm text-ink-500">
            <span className="text-accent-purple">$</span> ls stack/ -R
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {stack.map((s) => (
            <div
              key={s.dir}
              className="rounded-lg border border-edge bg-elevated p-4"
            >
              <p className="font-mono text-xs text-accent-amber mb-2">
                {s.dir}
              </p>
              <ul className="space-y-1">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-xs text-ink-300 pl-3 relative before:content-['·'] before:absolute before:left-0 before:text-ink-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-mono text-sm text-ink-500">
            <span className="text-accent-purple">$</span> git log --oneline
            -3
          </h2>
          <Link
            href="/projects"
            className="font-mono text-xs text-accent-blue hover:underline"
          >
            full log →
          </Link>
        </div>
        <ul className="space-y-3">
          {featuredProjects.map((p) => (
            <li
              key={p.slug}
              className="border border-edge rounded-lg bg-elevated px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
            >
              <span className="font-mono text-xs text-accent-amber shrink-0">
                {p.hash}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-mono text-sm text-ink-100">
                  {p.title}
                </span>
                <span className="block text-xs text-ink-500 mt-0.5">
                  {p.summary}
                </span>
              </span>
              <span className="font-mono text-xs text-ink-700 shrink-0">
                {p.date}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
