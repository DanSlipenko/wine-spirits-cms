import { Package, AlertTriangle, Boxes, DollarSign } from "lucide-react";

import { KpiCard } from "@/components/kpi-card";
import { WineInventoryTable } from "@/components/wine-inventory-table";

export const dynamic = "force-dynamic";

export default function InventoryPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="flex min-w-0 flex-col gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Total SKUs" value="1,842" delta="+24" deltaLabel="vs. last month" deltaTone="positive" />
          <KpiCard title="On Hand Value" value="$2.4M" delta="+6.2%" deltaLabel="vs. last month" deltaTone="positive" />
          <KpiCard title="Low Stock" value="37" delta="+12" deltaLabel="need reorder" deltaTone="negative" />
          <KpiCard title="Out of Stock" value="8" delta="-3" deltaLabel="vs. last week" deltaTone="positive" />
        </div>
      </div>

      <div className="min-w-0 bg-white px-6 pt-2 pb-8 dark:bg-black">
        <div className="min-w-0 py-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Inventory</h1>
              <p className="text-sm text-zinc-500">
                Browse wine &amp; spirits products. Click any row to view details.
              </p>
            </div>
            <div className="hidden items-center gap-4 text-xs text-zinc-500 sm:flex">
              <IconLegend icon={Package}>SKUs</IconLegend>
              <IconLegend icon={Boxes}>Stock</IconLegend>
              <IconLegend icon={DollarSign}>Pricing</IconLegend>
              <IconLegend icon={AlertTriangle}>Alerts</IconLegend>
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-md">
            <WineInventoryTable />
          </div>
        </div>
      </div>
    </div>
  );
}

function IconLegend({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="size-3.5" strokeWidth={1.5} />
      {children}
    </span>
  );
}
