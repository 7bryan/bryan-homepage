"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";

export default function CommitLog({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);

  return (
    <li className="border border-edge rounded-lg bg-elevated overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full text-left px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-overlay/50 transition-colors"
      >
        <span className="font-mono text-xs text-accent-amber shrink-0">
          {project.hash}
        </span>

        <span className="flex-1 min-w-0">
          <span className="block font-mono text-sm text-ink-100">
            {project.title}
          </span>
          <span className="block text-xs text-ink-500 mt-0.5">
            {project.summary}
          </span>
        </span>

        <span className="flex items-center gap-3 font-mono text-xs shrink-0">
          <span className="text-accent-green">+{project.additions}</span>
          <span className="text-accent-red">-{project.deletions}</span>
          <span className="text-ink-700">{project.date}</span>
          <span
            className={`text-ink-500 transition-transform ${
              open ? "rotate-90" : ""
            }`}
            aria-hidden
          >
            ›
          </span>
        </span>
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-edge/70 animate-fadeUp">
          <p className="text-sm text-ink-300 leading-relaxed max-w-2xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[11px] px-2 py-1 rounded border border-edge text-ink-500 bg-overlay/60"
              >
                {tag}
              </span>
            ))}
          </div>
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 font-mono text-xs text-accent-blue hover:underline"
            >
              view source →
            </a>
          )}
        </div>
      )}
    </li>
  );
}
