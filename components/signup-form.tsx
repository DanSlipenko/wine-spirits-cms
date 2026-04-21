"use client";

import * as React from "react";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormState = {
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  marketing: boolean;
};

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  company: "",
  role: "",
  email: "",
  password: "",
  acceptTerms: false,
  marketing: true,
};

const ROLES = ["Distributor", "Retailer", "Winery", "Importer", "Restaurant / Bar", "Other"];

export function SignupForm() {
  const [form, setForm] = React.useState<FormState>(INITIAL);
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));

  const passwordChecks = React.useMemo(
    () => [
      { label: "At least 8 characters", ok: form.password.length >= 8 },
      { label: "One uppercase letter", ok: /[A-Z]/.test(form.password) },
      { label: "One number", ok: /\d/.test(form.password) },
    ],
    [form.password],
  );

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const passwordValid = passwordChecks.every((c) => c.ok);
  const canSubmit =
    form.firstName.trim() && form.lastName.trim() && form.company.trim() && emailValid && passwordValid && form.acceptTerms && !submitting;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
          <Check className="size-6" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Welcome aboard!</h2>
          <p className="mt-1 text-sm text-zinc-500">
            We sent a confirmation link to <span className="font-medium text-zinc-900 dark:text-zinc-100">{form.email}</span>.
          </p>
        </div>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
          Back to form
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" htmlFor="firstName">
          <Input
            id="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="Jane"
            className="h-10"
            required
          />
        </Field>
        <Field label="Last name" htmlFor="lastName">
          <Input
            id="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Sommelier"
            className="h-10"
            required
          />
        </Field>
      </div>

      <Field label="Company" htmlFor="company">
        <Input
          id="company"
          autoComplete="organization"
          value={form.company}
          onChange={(e) => set("company", e.target.value)}
          placeholder="Vintner Collective"
          className="h-10"
          required
        />
      </Field>

      <Field label="Business type" htmlFor="role">
        <select
          id="role"
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          className={cn(
            "h-10 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm outline-none transition-colors",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
            "dark:bg-input/30",
          )}>
          <option value="" disabled>
            Select one…
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Work email" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="jane@vintner.co"
          className="h-10"
          aria-invalid={form.email.length > 0 && !emailValid}
          required
        />
        {form.email.length > 0 && !emailValid && <p className="mt-1 text-xs text-rose-600">Please enter a valid email address.</p>}
      </Field>

      <Field label="Password" htmlFor="password">
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="At least 8 characters"
            className="h-10 pr-9"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ?
              <EyeOff className="size-4" />
            : <Eye className="size-4" />}
          </button>
        </div>
        {form.password.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs">
            {passwordChecks.map((c) => (
              <li key={c.label} className={cn("flex items-center gap-1.5", c.ok ? "text-emerald-600" : "text-zinc-500")}>
                {c.ok ?
                  <Check className="size-3.5" strokeWidth={2.5} />
                : <X className="size-3.5" strokeWidth={2} />}
                {c.label}
              </li>
            ))}
          </ul>
        )}
      </Field>

      <div className="flex flex-col gap-2 border-t pt-4 dark:border-zinc-800">
        <Checkbox
          checked={form.acceptTerms}
          onChange={(v) => set("acceptTerms", v)}
          label={
            <>
              I agree to the{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Privacy Policy
              </a>
              .
            </>
          }
        />
        <Checkbox
          checked={form.marketing}
          onChange={(v) => set("marketing", v)}
          label="Send me product updates and tasting notes (optional)."
        />
      </div>

      <Button type="submit" disabled={!canSubmit} className="mt-1 h-10 w-full text-sm">
        {submitting ?
          <>
            <Loader2 className="size-4 animate-spin" />
            Creating account…
          </>
        : "Create account"}
      </Button>

      <div className="relative my-2 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
        <span className="text-xs uppercase tracking-wide text-zinc-400">or</span>
        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="outline" className="h-10">
          <GoogleGlyph />
          Google
        </Button>
        <Button type="button" variant="outline" className="h-10">
          <MicrosoftGlyph />
          Microsoft
        </Button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked ? "border-blue-600 bg-blue-600 text-white" : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900",
        )}>
        {checked && <Check className="size-3" strokeWidth={3} />}
      </span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
      <span className="leading-snug">{label}</span>
    </label>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="size-4" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.8 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5Z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7 12.9 19.6C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 34.9 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44Z"
      />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.9 36.6 44 31 44 24c0-1.3-.1-2.3-.4-3.5Z" />
    </svg>
  );
}

function MicrosoftGlyph() {
  return (
    <svg viewBox="0 0 23 23" className="size-4" aria-hidden>
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}
