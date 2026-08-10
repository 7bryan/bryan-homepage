import type { Metadata } from "next";
import CommitLog from "@/components/CommitLog";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Bryan",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-14 sm:py-20">
      <p className="font-mono text-xs text-accent-green mb-3">
        // everything I've shipped, most recent first
      </p>
      <h1 className="font-mono text-2xl sm:text-3xl text-ink-100 tracking-tight">
        git log --oneline --all
      </h1>
      <p className="mt-3 text-ink-500 text-sm max-w-lg leading-relaxed">
        {projects.length} commits on record. Click a row to expand the diff.
      </p>

      <ul className="mt-8 space-y-3">
        {projects.map((p) => (
          <CommitLog key={p.slug} project={p} />
        ))}
      </ul>
    </div>
  );
}
