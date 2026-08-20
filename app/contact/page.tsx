import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Bryan",
};

const channels = [
  {
    label: "GitHub",
    value: "@7bryan",
    href: "https://github.com/7bryan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.53-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.53 10.53 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
      </svg>
    ),
  },
  {
    label: "Email",
    value: "bryananthonywong@student.telkomuniversity.ac.id",
    href: "mailto:bryananthonywong@student.telkomuniversity.ac.id",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="w-5 h-5"
      >
        <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
        <path
          d="m3.5 6 8.5 6.5L20.5 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 min-h-[calc(100vh-6rem)] flex flex-col justify-center py-14">
      <p className="text-xs font-medium tracking-[0.2em] text-ink-500 uppercase mb-4">
        Contact
      </p>

      <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] text-ink-100 tracking-tight">
        Let&apos;s talk
        <span className="inline-block w-[2px] h-8 -mb-1.5 ml-1 bg-accent animate-blink align-middle" />
      </h1>

      <p className="mt-5 text-ink-300 text-base leading-relaxed max-w-md">
        Have a project, a bug you can&apos;t crack, or just want to talk shop?
        These are the two ways to reach me.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.label === "GitHub" ? "_blank" : undefined}
            rel={c.label === "GitHub" ? "noreferrer" : undefined}
            className="group glass rounded-2xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between text-ink-300 group-hover:text-accent transition-colors">
              {c.icon}
              <span
                aria-hidden
                className="text-ink-500 group-hover:text-accent group-hover:translate-x-0.5 transition-all"
              >
                →
              </span>
            </div>
            <div className="mt-8">
              <p className="text-xs text-ink-500 uppercase tracking-wide">
                {c.label}
              </p>
              <p className="mt-1 font-display text-ink-100 text-lg break-all">
                {c.value}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
