"use client";

import * as React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

export type YoySalesPoint = {
  month: string;
  currentYearSales: number;
  lastYearSales: number;
};

const BLUE = "#2563eb";
const BLUE_LIGHT = "#93c5fd";

const formatDollars = (n: number) =>
  `$ ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0)}`;

const formatAxis = (n: number) =>
  `$ ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0)}`;

export function YoySalesChart({
  data,
  currentYear,
  lastYear,
  height = 360,
}: {
  data: YoySalesPoint[];
  currentYear: number;
  lastYear: number;
  height?: number;
}) {
  return (
    <div className="rounded-sm border bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">YoY Sales Trend</h3>
        <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
          <LegendSwatch color={BLUE} label={`${currentYear}`} />
          <LegendSwatch color={BLUE_LIGHT} label={`${lastYear}`} />
        </div>
      </div>

      <div style={{ width: "100%", height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 24, right: 16, left: 16, bottom: 8 }} barCategoryGap="20%" barGap={4}>
            <CartesianGrid stroke="#eee" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: "#e5e7eb" }} tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis
              tickFormatter={formatAxis}
              tickLine={false}
              axisLine={{ stroke: "#e5e7eb" }}
              tick={{ fill: "#6b7280", fontSize: 11 }}
              width={90}
            />
            <Tooltip
              cursor={{ fill: "rgba(37,99,235,0.06)" }}
              formatter={(v) => formatDollars(Number(v))}
              contentStyle={{ fontSize: 12, borderRadius: 4 }}
            />
            <Bar dataKey="currentYearSales" name={`${currentYear}`} fill={BLUE} radius={[2, 2, 0, 0]}>
              <LabelList
                dataKey="currentYearSales"
                position="insideTop"
                angle={-90}
                offset={20}
                formatter={(v) => (v ? formatDollars(Number(v)) : "")}
                style={{ fill: "#fff", fontSize: 10, fontWeight: 500 }}
              />
            </Bar>
            <Bar dataKey="lastYearSales" name={`${lastYear}`} fill={BLUE_LIGHT} radius={[2, 2, 0, 0]}>
              <LabelList
                dataKey="lastYearSales"
                position="top"
                angle={-90}
                offset={28}
                formatter={(v) => (v ? formatDollars(Number(v)) : "")}
                style={{ fill: "#374151", fontSize: 10, fontWeight: 500 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block size-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
