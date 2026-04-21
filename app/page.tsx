import { LayoutGrid, Package, ShoppingCart, TrendingUp, Users, Calendar } from "lucide-react";

import { connectToDatabase } from "@/lib/mongodb";
import { Inventory } from "@/models";
import { Tabs, TabsList, TabsTab, TabsPanels, TabsPanel } from "@/components/animate-ui/components/base/tabs";
import { InventoryTable, type InventoryRow } from "@/components/inventory-table";
import { getDashboardData, formatCompact, formatPct } from "@/lib/dashboard-data";
import { KpiCard } from "@/components/kpi-card";
import { YoySalesChart } from "@/components/yoy-sales-chart";

export const dynamic = "force-dynamic";

const TABS = [
  { value: "inventory", label: "Inventory", icon: Package },
  { value: "open-sales-orders", label: "Open Sales Orders", icon: ShoppingCart },
  { value: "yoy-by-item", label: "YoY Sales by Item", icon: TrendingUp },
  { value: "yoy-by-customer", label: "YoY Sales by Customer", icon: Users },
  { value: "yoy-by-month", label: "YoY Sales by Month", icon: Calendar },
  { value: "monthly-depletions", label: "Monthly Depletions", icon: LayoutGrid },
];

async function getInventory(): Promise<InventoryRow[]> {
  await connectToDatabase();
  const docs = await Inventory.find().sort({ onHand: -1 }).lean();
  return docs.map((d) => ({
    id: String(d._id),
    location: d.location,
    itemSku: d.itemSku,
    itemNumber: d.itemNumber,
    itemDescription: d.itemDescription,
    onHand: d.onHand,
    allocated: d.allocated,
    available: d.available,
    onOrder: d.onOrder,
    ytdCases: d.ytdCases,
    mtdCases: d.mtdCases,
    last30DayCases: d.last30DayCases,
    last60DayCases: d.last60DayCases,
    last90DayCases: d.last90DayCases,
    onHandValue: d.onHandValue,
  }));
}

function EmptyPanel({ title }: { title: string }) {
  return (
    <div className="flex min-h-[360px] flex-1 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
      {title} — coming soon
    </div>
  );
}

export default async function DashboardPage() {
  const [rows, dash] = await Promise.all([getInventory(), getDashboardData()]);
  const { kpi, monthly, currentYear, lastYear } = dash;

  const salesTone =
    kpi.salesYoyAbs > 0 ? "positive"
    : kpi.salesYoyAbs < 0 ? "negative"
    : "neutral";
  const casesTone =
    kpi.casesYoyAbs > 0 ? "positive"
    : kpi.casesYoyAbs < 0 ? "negative"
    : "neutral";

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-zinc-50 dark:bg-black">
      {/* Dashboard KPIs + chart */}
      <div className="flex min-w-0 flex-col gap-4 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            title="YTD Sales"
            value={formatCompact(kpi.ytdSales)}
            delta={formatCompact(kpi.lytdSales)}
            deltaLabel="LYTD Sales"
            deltaTone="neutral"
          />
          <KpiCard
            title="Sales YoY Var"
            value={formatCompact(kpi.salesYoyAbs)}
            delta={formatPct(kpi.salesYoyPct)}
            deltaLabel="Sales YoY Var %"
            deltaTone={salesTone}
          />
          <KpiCard
            title="YTD Cases"
            value={formatCompact(kpi.ytdCases)}
            delta={formatCompact(kpi.lytdCases)}
            deltaLabel="LYTD Cases"
            deltaTone="neutral"
          />
          <KpiCard
            title="Cases YoY Var"
            value={formatCompact(kpi.casesYoyAbs)}
            delta={formatPct(kpi.casesYoyPct)}
            deltaLabel="Cases YoY Var %"
            deltaTone={casesTone}
          />
        </div>

        <YoySalesChart data={monthly} currentYear={currentYear} lastYear={lastYear} />
      </div>

      {/* Inventory tabs */}
      <div className="min-w-0 bg-white px-6 pt-6 pb-8 dark:bg-black">
        <Tabs defaultValue="inventory" className="min-w-0 gap-4">
          <TabsList className="h-10 w-fit gap-1 rounded-[6px] p-0.5">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTab key={value} value={value} className="px-3 text-sm">
                <Icon className="size-4" />
                {label}
              </TabsTab>
            ))}
          </TabsList>

          <TabsPanels>
            <TabsPanel value="inventory">
              <div className="min-w-0 bg-white py-6 dark:bg-black">
                <div className="mb-4">
                  <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Inventory</h1>
                  <p className="text-sm text-zinc-500">Inventory + Sales Metrics</p>
                </div>
                <div className="w-full overflow-hidden rounded-md">
                  <InventoryTable data={rows} />
                </div>
              </div>
            </TabsPanel>

            {TABS.slice(1).map(({ value, label }) => (
              <TabsPanel key={value} value={value}>
                <div className="py-6">
                  <EmptyPanel title={label} />
                </div>
              </TabsPanel>
            ))}
          </TabsPanels>
        </Tabs>
      </div>
    </div>
  );
}
