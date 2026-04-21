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

const TEAL = "#1f8c88";

export function KpiCard({ title, value, delta, deltaLabel, deltaTone = "neutral", className }: KpiCardProps) {
  const deltaColor =
    deltaTone === "positive" ? "text-emerald-600"
    : deltaTone === "negative" ? "text-rose-600"
    : "text-zinc-500";

  return (
    <div
      className={cn(
        "flex min-h-[110px] flex-col items-center justify-center rounded-sm border bg-white px-6 py-4 text-center  dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}>
      <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{title}</div>
      <div className="mt-2 flex items-start gap-1">
        <span className="text-3xl font-semibold leading-none tracking-tight" style={{ color: TEAL }}>
          {value}
        </span>
        {delta && (
          <span className={cn("flex flex-col text-[11px] leading-tight", deltaColor)}>
            <span className="font-semibold">{delta}</span>
            {deltaLabel && <span className="text-[10px] text-zinc-500 dark:text-zinc-500">{deltaLabel}</span>}
          </span>
        )}
      </div>
    </div>
  );
}
