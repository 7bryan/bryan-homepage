const links = [
  { label: "GitHub", href: "https://github.com/7bryan" },
  {
    label: "Email",
    href: "mailto:bryananthonywong@student.telkomuniversity.ac.id",
  },
];

export default function Footer() {
  return (
    <footer className="px-4 sm:px-6 pb-6">
      <div className="glass mx-auto max-w-5xl rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p className="text-ink-500">
          <span className="text-ink-100 font-medium">Bryan</span> — available
          for new projects
        </p>
        <div className="flex items-center gap-5">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="text-ink-500 hover:text-accent transition-colors"
            >
              {l.label}
            </a>
          ))}
          <span className="text-ink-700">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
