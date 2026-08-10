const links = [
  { flag: "--github", href: "https://github.com/7bryan" },
  { flag: "--email", href: "mailto:hello@example.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-edge bg-base">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-ink-500">
        <p>
          <span className="text-accent-green">bryan</span>
          <span className="text-ink-700">@</span>portfolio
          <span className="text-ink-700">:~$</span>{" "}
          <span className="text-ink-300">whoami --status</span>{" "}
          <span className="text-accent-green">available for work</span>
        </p>
        <div className="flex items-center gap-4">
          {links.map((l) => (
            <a
              key={l.flag}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-ink-500 hover:text-accent-blue transition-colors"
            >
              {l.flag}
            </a>
          ))}
          <span className="text-ink-700">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
