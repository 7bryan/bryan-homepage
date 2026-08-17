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

// Hover accent for the card border — a fixed green regardless of theme, to
// match the reference's hover treatment.
const HOVER_GREEN = "#4ade80";

function tagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.16 0 1.56-.01 2.81-.01 3.19 0 .3.2.66.79.55A10.75 10.75 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export default function CommitLog({ project }: { project: Project }) {
  const isGithub = project.href?.includes("github.com") ?? false;
  const ctaLabel = project.ctaLabel ?? (isGithub ? "View Source on GitHub" : "Visit Site");

  return (
    <li
      className="group flex flex-col overflow-hidden rounded-xl border border-edge bg-elevated transition-colors duration-200 hover:border-[var(--hover-green)] hover:shadow-[0_0_24px_-10px_var(--hover-green)]"
      style={{ ["--hover-green" as string]: HOVER_GREEN }}
    >
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
            title={ctaLabel}
            aria-label={ctaLabel}
            className="mt-5 inline-flex h-9 w-9 items-center justify-center self-start rounded-md border border-edge text-ink-300 transition-colors hover:border-[var(--hover-green)] hover:text-[var(--hover-green)]"
          >
            {isGithub ? <GithubIcon /> : <ExternalLinkIcon />}
          </a>
        )}
      </div>
    </li>
  );
}
