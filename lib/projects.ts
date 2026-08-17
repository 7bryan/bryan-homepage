export type Project = {
  slug: string;
  // Kept for backward-compat with anything else on the site that might
  // still read these (e.g. the home page's "Featured work" cards) — the
  // new Projects grid below doesn't display them anymore.
  hash: string;
  additions: number;
  deletions: number;

  title: string;
  summary: string;
  description: string;
  tags: string[];
  date: string;
  href?: string;
  featured?: boolean;

  /**
   * Path to a thumbnail image under /public, e.g. "/projects/devpulse.png".
   * Drop the image file at that exact path and it'll just show up — no
   * further code changes needed.
   */
  image?: string;
  /** Small pill shown top-right of the card, e.g. "open source". Optional. */
  category?: string;
  /**
   * Button label. Defaults to "View Source on GitHub" when `href` points
   * at github.com, otherwise "Visit Site". Set explicitly to override.
   */
  ctaLabel?: string;
};

export const projects: Project[] = [
  {
    slug: "devpulse",
    hash: "a3f9c1e",
    title: "DevPulse",
    summary: "GitHub metrics tracker with a terminal / git-log aesthetic",
    description:
      "A FastAPI backend paired with a vanilla JS frontend that pulls GitHub activity and renders it as commit-style feeds, repo summaries, and contribution stats. Rebuilt around a monospace, git-log visual language rather than dashboard-chart defaults.",
    tags: ["FastAPI", "Python", "Vanilla JS", "REST"],
    additions: 482,
    deletions: 61,
    date: "2026-07",
    featured: true,
    href: "https://github.com/yourname/devpulse",
    image: "/projects/devpulse.png",
  },
  {
    slug: "chess-web",
    hash: "7c2e08b",
    title: "Chess AI — Web Remaster",
    summary: "Browser port of a Pygame + Stockfish engine",
    description:
      "A ground-up web remaster of an existing Pygame chess app, using FastAPI, python-chess, and Stockfish on the backend with a vanilla JS board on the front. Tokyo Night–influenced palette, Space Grotesk display type, deployed on Railway.",
    tags: ["FastAPI", "python-chess", "Stockfish", "Railway"],
    additions: 610,
    deletions: 94,
    date: "2026-05",
    featured: true,
    image: "/projects/chess-web.png",
  },
  {
    slug: "caelum",
    hash: "e19a4d2",
    title: "Caelum",
    summary: "NASA APOD explorer with an observatory field-atlas look",
    description:
      "A Flask app that surfaces NASA's Astronomy Picture of the Day archive. Backend adds in-memory caching and retry logic to handle NASA API rate limits; frontend styled as a field atlas with ink-navy, gold, and copper tones.",
    tags: ["Flask", "Python", "NASA API", "Caching"],
    additions: 355,
    deletions: 40,
    date: "2026-03",
    featured: true,
    image: "/projects/caelum.png",
  },
  {
    slug: "horeg-music",
    hash: "2d81f6a",
    title: "Horeg Music",
    summary: "Discord music bot, refactored into a cog architecture",
    description:
      "Started as a single-file bot and was refactored into a multi-cog structure for maintainability, then deployed on Railway. Handles queueing, playback controls, and voice-channel lifecycle.",
    tags: ["Python", "discord.py", "Railway", "FFmpeg", "yt-dlp"],
    additions: 290,
    deletions: 175,
    date: "2025-12",
    image: "/projects/horeg-music.png",
  },
  {
    slug: "tomatab",
    hash: "9b0c3ee",
    title: "Tomatab",
    summary: "Cross-browser Pomodoro timer extension",
    description:
      "A Pomodoro timer browser extension built in vanilla TypeScript and Tailwind CSS v4, using an offscreen page for audio so timers keep running reliably across tab and browser lifecycle events.",
    tags: ["TypeScript", "Tailwind CSS", "Chrome APIs"],
    additions: 214,
    deletions: 22,
    date: "2025-10",
    image: "/projects/tomatab.png",
  },
  {
    slug: "waste-track",
    hash: "5f7e112",
    title: "WASTE-TRACK",
    summary: "Go-based CLI for tracking waste collection",
    description:
      "A command-line waste tracking tool written in Go, with Indonesian-language output for local usability. Shipped with a full README and pseudocode documentation for the core routines.",
    tags: ["Go", "CLI"],
    additions: 168,
    deletions: 12,
    date: "2025-06",
    image: "/projects/waste-track.png",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
