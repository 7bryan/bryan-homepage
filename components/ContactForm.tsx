"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    setStatus("sending");

    // Wire this up to your form handler / API route of choice.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-accent-green/30 bg-elevated p-6 font-mono text-sm">
        <p className="text-accent-green">$ send message.txt</p>
        <p className="text-ink-300 mt-2">
          200 OK — message sent. I'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-edge bg-elevated p-5 sm:p-6 space-y-5"
    >
      <Field
        label="name"
        value={name}
        onChange={setName}
        placeholder="Ada Lovelace"
      />
      <Field
        label="email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="ada@example.com"
      />
      <div>
        <label className="block font-mono text-xs text-ink-500 mb-1.5">
          <span className="text-accent-purple">field</span> message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="What's on your mind?"
          className="w-full bg-base border border-edge rounded px-3 py-2.5 text-sm text-ink-100 font-mono placeholder:text-ink-700 focus:border-accent-blue transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="font-mono text-xs text-accent-red">
          error: all fields are required before sending.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full sm:w-auto px-5 py-2.5 rounded border border-accent-blue/40 text-accent-blue font-mono text-sm hover:bg-accent-blue/10 transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "sending..." : "$ send message.txt"}
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-mono text-xs text-ink-500 mb-1.5">
        <span className="text-accent-purple">field</span> {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-base border border-edge rounded px-3 py-2.5 text-sm text-ink-100 font-mono placeholder:text-ink-700 focus:border-accent-blue transition-colors"
      />
    </div>
  );
}
