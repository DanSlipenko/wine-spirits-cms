import * as React from "react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string;
  delta?: string;
  deltaLabel?: string;
  deltaTone?: "positive" | "negative" | "neutral";
  className?: string;
};

const BLUE = "#2563eb";

export function KpiCard({ title, value, delta, deltaLabel, deltaTone = "neutral", className }: KpiCardProps) {
  const deltaColor =
    deltaTone === "positive" ? "text-sky-600"
    : deltaTone === "negative" ? "text-rose-600"
    : "text-zinc-500";

  return (
    <div
      className={cn(
        "flex min-h-[125px] flex-col items-center justify-center rounded-4xl shadow-primary bg-white px-6 py-6 text-center",
        className,
      )}>
      <div className="text-base font-medium text-zinc-600 dark:text-zinc-400">{title}</div>
      <div className="mt-5 flex items-start gap-1">
        <span className="text-4xl font-semibold leading-none tracking-tight" style={{ color: BLUE }}>
          {value}
        </span>
        {delta && (
          <span className={cn("flex flex-col text-sm leading-tight", deltaColor)}>
            <span className="font-semibold">{delta}</span>
            {deltaLabel && <span className="text-sm text-zinc-500 dark:text-zinc-500">{deltaLabel}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
