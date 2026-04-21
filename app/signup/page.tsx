import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { ColumnLines } from "@/components/ui/columnlines";

export const metadata = {
  title: "Sign up · Wine & Spirits CRM",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left: brand panel (hidden on small screens) */}
      <aside className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-white lg:flex lg:flex-col lg:justify-between lg:p-10 dark:from-zinc-950 shadow-xl dark:via-zinc-950 dark:to-black">
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <WineIcon />
          </div>
          <div className="flex flex-col text-sm leading-tight">
            <span className="font-semibold">Wine &amp; Spirits</span>
            <span className="text-muted-foreground text-xs">CRM</span>
          </div>
        </div>
        <div className="relative z-10 max-w-md">
          <h2 className="font-serif text-4xl leading-tight text-zinc-900 dark:text-zinc-50">
            Manage your cellar, sales, and customers — all in one place.
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Track inventory across locations, price products with confidence, and watch your YoY performance in real time.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <Feature>Real-time inventory &amp; depletion tracking</Feature>
            <Feature>Integrated pricing and margin simulator</Feature>
            <Feature>Custom reports for distributors &amp; retailers</Feature>
          </ul>
        </div>
        <div className="relative z-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} Wine &amp; Spirits CRM. All rights reserved.
        </div>{" "}
      </aside>

      {/* Right: form */}
      <main className="relative flex flex-1 items-center justify-center overflow-hidden bg-white px-6 py-12 dark:bg-black">
        <ColumnLines className="absolute inset-0" columnCount={40} columnWidth={80} radialFadeStart={100} radialFadeEnd={100} opacity={1} />
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
              <WineIcon />
            </div>
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-semibold">Wine &amp; Spirits</span>
              <span className="text-muted-foreground text-xs">CRM</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Create your account</h1>
            <p className="mt-1 text-sm text-zinc-500">Start your 14-day free trial. No credit card required.</p>
          </div>

          <div className="rounded-md border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <SignupForm />
          </div>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1 inline-block size-1.5 shrink-0 rounded-full bg-blue-600" />
      <span>{children}</span>
    </li>
  );
}

function WineIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5">
      <path d="M8 22h8" />
      <path d="M7 10h10" />
      <path d="M12 15v7" />
      <path d="M12 15a5 5 0 0 0 5-5V3H7v7a5 5 0 0 0 5 5Z" />
    </svg>
  );
}

function BottleSilhouette({ className, variant = "red" }: { className?: string; variant?: "red" | "white" }) {
  const body = variant === "red" ? "fill-rose-900/60" : "fill-amber-100/80";
  const cap = variant === "red" ? "fill-zinc-900/70" : "fill-zinc-800/50";
  return (
    <svg viewBox="0 0 100 320" className={className} aria-hidden>
      <rect x="42" y="0" width="16" height="18" rx="2" className={cap} />
      <path d="M43 18 L57 18 L57 80 Q66 95 66 110 L66 300 Q66 316 50 316 Q34 316 34 300 L34 110 Q34 95 43 80 Z" className={body} />
      <rect x="38" y="170" width="24" height="70" rx="2" className="fill-white/80" />
    </svg>
  );
}
