"use client";

import { useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sendContact, type ContactState } from "@/app/actions/contact";
import { budgetOptions, services } from "@/data/services";
import { Icon } from "@/components/ui/Icon";

type Reason = "" | "job" | "project" | "other";

const reasons: { value: Exclude<Reason, "">; label: string }[] = [
  { value: "job", label: "A job opportunity" },
  { value: "project", label: "A project" },
  { value: "other", label: "Something else" },
];

const empty = { name: "", email: "", service: "", budget: "", message: "" };
const initialState: ContactState = { status: "idle" };

const inputCls =
  "w-full min-h-12 rounded-lg border border-line bg-bg px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-danger";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger">
      {message}
    </p>
  );
}

export function ContactForm() {
  const params = useSearchParams();
  const presetSlug = params.get("service");

  const [state, formAction, isPending] = useActionState(sendContact, initialState);
  const [values, setValues] = useState(empty);
  const [reason, setReason] = useState<Reason>("");

  useEffect(() => {
    const preset = services.find((s) => s.slug === presetSlug);
    if (preset) {
      setReason("project");
      setValues((v) => ({ ...v, service: preset.title }));
    }
  }, [presetSlug]);

  useEffect(() => {
    if (state.status === "success") {
      setValues(empty);
      setReason("");
    }
  }, [state]);

  const set =
    (key: keyof typeof empty) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const errors = state.status === "error" ? state.errors ?? {} : {};

  return (
    <form action={formAction} noValidate className="relative flex flex-col gap-6">
      {/* Spam trap, hidden from people */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Your name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputCls}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputCls}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <fieldset aria-describedby={errors.reason ? "reason-error" : undefined}>
        <legend className="mb-2.5 text-sm font-medium">I’m reaching out about…</legend>
        <div className="flex flex-wrap gap-2.5">
          {reasons.map((r) => (
            <label
              key={r.value}
              className={`inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-[15px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                reason === r.value ? "border-ink bg-ink text-bg" : "border-line bg-bg hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r.value}
                checked={reason === r.value}
                onChange={() => setReason(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
        <FieldError id="reason-error" message={errors.reason} />
      </fieldset>

      {reason === "project" && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="service" className="mb-2 block text-sm font-medium">
              Service <span className="font-normal text-muted">(optional)</span>
            </label>
            <select id="service" name="service" value={values.service} onChange={set("service")} className={inputCls}>
              <option value="">Not sure yet</option>
              {services.map((s) => (
                <option key={s.slug} value={s.title}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="budget" className="mb-2 block text-sm font-medium">
              Budget <span className="font-normal text-muted">(optional)</span>
            </label>
            <select id="budget" name="budget" value={values.budget} onChange={set("budget")} className={inputCls}>
              <option value="">Prefer not to say</option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          placeholder="What are you building, and how can I help?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${inputCls} resize-y`}
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60"
        >
          {isPending ? "Sending…" : "Send message"}
          {!isPending && <Icon name="arrow" />}
        </button>

        <p aria-live="polite" className="text-sm">
          {state.status === "success" && (
            <span className="inline-flex items-center gap-2 text-live">
              <Icon name="check" />
              {state.message}
            </span>
          )}
          {state.status === "error" && !Object.keys(errors).length && (
            <span className="text-danger">{state.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}