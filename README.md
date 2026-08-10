# Bryan — Portfolio

Personal site + portfolio. Next.js 14 (App Router), React, TypeScript, Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

```
app/
  layout.tsx          root layout, fonts, metadata
  globals.css          base styles, grid background, focus states
  page.tsx              home (terminal hero, stack, featured projects)
  projects/page.tsx     full project list ("git log")
  about/page.tsx         bio / timeline
  contact/page.tsx       contact page shell
components/
  Nav.tsx               breadcrumb-style nav
  Footer.tsx            terminal-prompt footer
  Terminal.tsx           typed hero terminal
  CommitLog.tsx          expandable project row (used on /projects)
  ContactForm.tsx        client-side contact form
lib/
  projects.ts            single source of truth for project data
```

## Design notes

- Palette: Tokyo Night–derived (`#16161e` base / blue, green, amber, red,
  purple accents), each color used for a specific function rather than
  decoration. Defined in `tailwind.config.ts`.
- Type: JetBrains Mono for nav/labels/code-voiced UI, IBM Plex Sans for body
  copy. Loaded via `next/font/google` in `app/layout.tsx`.
- Content model: `lib/projects.ts` is the single place to add, edit, or
  reorder projects — both the homepage's featured list and the full
  `/projects` log read from it.

## Next steps

- Wire `components/ContactForm.tsx` up to a real endpoint (an API route,
  Formspree, Resend, etc.) — it currently simulates a submit.
- Swap the placeholder email/GitHub links in `components/Footer.tsx`.
- Add real project links (`href`) in `lib/projects.ts` as repos go public.
