import Link from "next/link";
import SocialRow from "@/components/SocialRow";
import { featuredProjects } from "@/lib/projects";

export default function HomePage() {
  return (
    <div className="relative">
      <section className="relative mx-auto max-w-5xl px-5 sm:px-8 min-h-[calc(100vh-6rem)] flex flex-col justify-center pb-24">
        <div className="max-w-2xl">
          <SocialRow />

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.02] text-ink-100 mt-8 tracking-tight">
            Hey, I&apos;m Bryan.
          </h1>

          <p className="mt-5 text-ink-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Full-stack &amp; systems developer, building web apps, tools, and
            the occasional CLI — with a running interest in security.
          </p>

          <p className="mt-6 font-display text-lg sm:text-xl text-ink-100">
            I build things, break things in CTFs, and write it down
            <span className="inline-block w-[2px] h-5 -mb-1 ml-1 bg-accent animate-blink align-middle" />
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-100 border border-edge rounded-full px-5 py-2.5 hover:bg-white/[0.06] transition-colors"
            >
              View my work
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-ink-500 hover:text-ink-100 transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 sm:px-8 pb-28">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink-100">
            Featured work
          </h2>
          <Link
            href="/projects"
            className="text-sm text-ink-500 hover:text-ink-100 transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {featuredProjects.map((p) => (
            <Link
              key={p.slug}
              href="/projects"
              className="group border border-edge rounded-2xl p-5 flex flex-col hover:bg-white/[0.03] hover:border-ink-700 transition-colors"
            >
              <h3 className="font-display font-medium text-ink-100">
                {p.title}
              </h3>
              <p className="text-ink-500 text-sm mt-1.5 leading-relaxed">
                {p.summary}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {p.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-1 rounded-full border border-edge-soft text-ink-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
