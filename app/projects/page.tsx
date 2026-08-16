import type { Metadata } from "next";
import CommitLog from "@/components/CommitLog";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Bryan",
};

// everything I've shipped, most recent first
export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <h1 className="font-display text-3xl tracking-tight text-ink-100 sm:text-4xl">
        Projects
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-500">
        {projects.length} things I&apos;ve built, from shipped tools to
        weekend experiments.
      </p>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <CommitLog key={p.slug} project={p} />
        ))}
      </ul>
    </div>
  );
}
