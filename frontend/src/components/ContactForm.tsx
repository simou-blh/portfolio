"use client";

import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaRegCommentDots, FaRegEnvelope, FaRegPaperPlane, FaRegUser } from "react-icons/fa6";

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
  "w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-11 pr-4 font-medium text-paper outline-none transition placeholder:text-paper/45 focus:border-mint aria-[invalid=true]:border-coral";

function Field({
  id, label, icon, top, error, children,
}: { id: string; label: string; icon: ReactNode; top?: boolean; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        <span
          className={`pointer-events-none absolute left-4 text-paper/50 ${top ? "top-4" : "top-1/2 -translate-y-1/2"}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        {children}
      </div>
      {error && <p id={`${id}-error`} className="mt-1.5 text-[0.9rem] text-coral">{error}</p>}
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
      <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6" role="status">
        <h3 className="text-[clamp(1.3rem,2.4vw,1.8rem)] font-extrabold leading-[1.1]">Message sent. Thank you!</h3>
        <p>I&apos;ll get back to you as soon as I can.</p>
        <button type="button" className="btn cursor-pointer justify-self-start" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5">
      <Field id="name" label="Name" icon={<FaRegUser />} error={errors.name?.message}>
        <input
          id="name" autoComplete="name" placeholder="Your name" className={field}
          aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </Field>

      <Field id="email" label="Email" icon={<FaRegEnvelope />} error={errors.email?.message}>
        <input
          id="email" type="email" autoComplete="email" placeholder="you@example.com" className={field}
          aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
      </Field>

      <Field id="message" label="Message" icon={<FaRegCommentDots />} top error={errors.message?.message}>
        <textarea
          id="message" rows={5} placeholder="Tell me about your project or opportunity..."
          className={`${field} resize-y`}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
      </Field>

      {/* honeypot */}
      <input type="checkbox" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("botcheck")} />

      <button
        type="submit" disabled={status === "sending"}
        className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-mint px-6 py-3.5 text-[1.05rem] font-bold text-white shadow-lg shadow-mint/30 transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
      >
        <FaRegPaperPlane aria-hidden="true" />
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
      {status === "error" && (
        <p role="alert" className="text-coral">
          Something went wrong. Please try again, or reach me on LinkedIn.
          {process.env.NODE_ENV === "development" && ` [dev: ${errorMsg}]`}
        </p>
      )}
    </form>
  );
}