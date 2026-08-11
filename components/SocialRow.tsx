const socials = [
  {
    label: "GitHub",
    href: "https://github.com/7bryan",
    icon: (
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM.5 8.98h4.5V23H.5V8.98ZM8.5 8.98h4.31v1.92h.06c.6-1.13 2.07-2.33 4.26-2.33 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.7c0-1.6-.03-3.65-2.22-3.65-2.23 0-2.57 1.74-2.57 3.53V23H8.5V8.98Z" />
    ),
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    icon: (
      <path d="M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.4 2 8.6 6.2L20.6 7H3.4ZM21 8.4l-8.42 6.07a1 1 0 0 1-1.16 0L3 8.4V17h18V8.4Z" />
    ),
  },
];

export default function SocialRow() {
  return (
    <div className="flex items-center gap-2.5">
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-edge bg-white/[0.03] text-ink-500 hover:text-ink-100 hover:bg-white/[0.06] transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            {s.icon}
          </svg>
        </a>
      ))}
    </div>
  );
}
