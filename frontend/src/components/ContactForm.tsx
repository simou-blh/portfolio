"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email."),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a bit more (10 characters minimum).")
    .max(2000, "Keep it under 2000 characters."),
  botcheck: z.boolean().optional(), // honeypot, real people never tick it
});

type FormValues = z.infer<typeof schema>;
type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full rounded-xl border-2 border-paper bg-ink/40 px-4 py-3 font-medium text-paper outline-none transition placeholder:text-paper/45 focus:border-mint aria-[invalid=true]:border-coral";

function Field({
  id, label, error, children,
}: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium">{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.9rem] text-coral">{error}</p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register, handleSubmit, reset, formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    if (values.botcheck) {
      setStatus("success"); // pretend success to bots, send nothing
      return;
    }
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
  setErrorMsg("Missing NEXT_PUBLIC_WEB3FORMS_KEY. Check .env.local and restart the dev server.");
  setStatus("error");
  return;
}
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New portfolio message from ${values.name}`,
          from_name: "Portfolio contact form",
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      });
          const data = await res.json();
    if (!data.success) throw new Error(data.message ?? `HTTP ${res.status}`);
    reset();
    setStatus("success");
  } catch (e) {
    setErrorMsg(e instanceof Error ? e.message : "Network error");
    setStatus("error");
  }
  }

  if (status === "success") {
    return (
      <div className="card light grid gap-4" role="status">
        <h3 className="text-[clamp(1.4rem,2.6vw,2rem)] font-extrabold leading-[1.1]">
          Message sent. Thank you!
        </h3>
        <p>I&apos;ll get back to you as soon as I can.</p>
        <button type="button" className="btn cursor-pointer justify-self-start" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card grid gap-5">
      <Field id="name" label="Name" error={errors.name?.message}>
        <input
          id="name" autoComplete="name" placeholder="Your name" className={field}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email?.message}>
        <input
          id="email" type="email" autoComplete="email" placeholder="you@example.com" className={field}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field id="message" label="Message" error={errors.message?.message}>
        <textarea
          id="message" rows={6} placeholder="Tell me about your project or opportunity..."
          className={`${field} resize-y`}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
      </Field>

      {/* honeypot */}
      <input
        type="checkbox" tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="hidden" {...register("botcheck")}
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit" disabled={status === "sending"}
          className="btn main cursor-pointer disabled:cursor-wait disabled:opacity-60"
        >
          {status === "sending" ? "Sending..." : "Send message"}
        </button>
        {status === "error" && (
  <p role="alert" className="text-coral">
    Something went wrong. Please try again, or reach me on LinkedIn.
    {process.env.NODE_ENV === "development" && ` [dev: ${errorMsg}]`}
  </p>
)}
      </div>
    </form>
  );
}