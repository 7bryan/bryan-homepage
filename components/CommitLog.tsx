import Image from "next/image";
import type { Project } from "@/lib/projects";

// Deterministic per-tag color so the same tag always renders the same
// color across every card, without needing to hand-map every tech name.
const TAG_PALETTE = [
  "#7c93ff", // indigo (matches --color-accent)
  "#5ec8a6", // teal
  "#e0a458", // amber
  "#e2637c", // rose
  "#8f7cff", // violet
  "#5eb8e0", // sky
];

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

export default function CommitLog({ project }: { project: Project }) {
  const ctaLabel =
    project.ctaLabel ??
    (project.href?.includes("github.com")
      ? "View Source on GitHub"
      : "Visit Site");

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-edge bg-elevated">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <h3 className="font-display text-lg text-ink-100">{project.title}</h3>
        {project.category && (
          <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent">
            {project.category}
          </span>
        )}
      </div>

      {project.image && (
        <div className="relative mx-5 mt-4 aspect-video overflow-hidden rounded-lg border border-edge-soft bg-base">
          <Image
            src={project.image}
            alt={`${project.title} preview`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <p className="text-sm text-ink-300">{project.summary}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => {
            const color = tagColor(tag);
            return (
              <span
                key={tag}
                className="rounded-md border px-2 py-1 font-mono text-[11px]"
                style={{
                  color,
                  borderColor: `${color}4D`, // ~30% opacity
                  backgroundColor: `${color}1A`, // ~10% opacity
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-md border border-edge px-4 py-2 text-sm text-ink-100 transition-colors hover:border-accent/40 hover:bg-accent/10"
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </li>
  );
}
