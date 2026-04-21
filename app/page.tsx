import { connectToDatabase } from '@/lib/mongodb';
import { Inventory } from '@/models';
import { InventoryTable, type InventoryRow } from '@/components/inventory-table';

export const dynamic = 'force-dynamic';

const TABS = [
  'Inventory',
  'Open Sales Orders',
  'YoY Sales by Item',
  'YoY Sales by Customer',
  'YoY Sales by Month',
  'Monthly Depletions',
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

export default async function Home() {
  const rows = await getInventory();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <div className="border-b bg-white px-6 pt-4 dark:bg-black">
        <div className="flex flex-wrap items-center gap-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              className={`flex items-center gap-2 rounded-t-sm border border-b-0 px-4 py-2 text-sm font-medium transition-colors ${
                i === 0
                  ? 'border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white'
                  : 'border-transparent bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <span className="inline-block size-4 rounded-xs border border-current opacity-60" />
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white p-6 dark:bg-black">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Inventory
          </h1>
          <p className="text-sm text-zinc-500">Inventory + Sales Metrics</p>
        </div>

        <InventoryTable data={rows} />
      </div>
    </div>
  );
}
