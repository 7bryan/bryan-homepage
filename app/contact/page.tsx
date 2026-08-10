import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Bryan",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-14 sm:py-20">
      <p className="font-mono text-xs text-accent-green mb-3">
        $ nano message.txt
      </p>
      <h1 className="font-mono text-2xl sm:text-3xl text-ink-100 tracking-tight mb-3">
        get in touch
      </h1>
      <p className="text-ink-500 text-sm max-w-md leading-relaxed mb-8">
        Have a project, a bug you can't crack, or just want to talk shop?
        Fill this in and send it my way.
      </p>

      <ContactForm />
    </div>
  );
}
