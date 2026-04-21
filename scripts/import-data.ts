import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { parse } from 'csv-parse/sync';

import { Sales } from '../models/Sales';
import { Inventory } from '../models/Inventory';
import { Item } from '../models/Item';

const SALES_CSV = path.resolve('data/sales.csv');
const INVENTORY_CSV = path.resolve('data/inventory.csv');

function toNumber(v: string | undefined | null): number {
  if (v == null) return 0;
  const s = String(v).trim();
  if (!s || s === '-' || s === 'N/A') return 0;
  const cleaned = s.replace(/[$,\s]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function toStr(v: string | undefined | null): string {
  if (v == null) return '';
  const s = String(v).trim();
  return s === '-' ? '' : s;
}

// Parse M/D/YYYY into a UTC Date to avoid local timezone drift.
function toDate(v: string | undefined | null): Date | null {
  if (!v) return null;
  const s = String(v).trim();
  if (!s || s === '-') return null;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, mo, d, y] = m;
    return new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
  }
  const parsed = new Date(s);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

type SalesRow = Record<string, string>;
type InventoryRow = Record<string, string>;

function readCsv<T>(file: string): T[] {
  const content = fs.readFileSync(file, 'utf8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as T[];
}

async function importSales() {
  const rows = readCsv<SalesRow>(SALES_CSV);
  console.log(`→ Parsed ${rows.length} sales rows from ${path.basename(SALES_CSV)}`);

  const itemOps = new Map<string, any>();
  const salesOps: any[] = [];
  let skipped = 0;

  for (const r of rows) {
    const itemNumber = toStr(r['Item #']);
    const invoiceNumber = toStr(r['Inv#']);
    const invoiceDate = toDate(r['INVOICE_DATE.autoCalendar.Date']);
    const period = toDate(r['Period']) ?? invoiceDate;

    if (!itemNumber || !invoiceNumber || !invoiceDate) {
      skipped++;
      continue;
    }

    if (!itemOps.has(itemNumber)) {
      itemOps.set(itemNumber, {
        updateOne: {
          filter: { itemNumber },
          update: {
            $set: {
              itemNumber,
              itemDescription: toStr(r['Item Description']),
              client: toStr(r['Client']),
              producer: toStr(r['Producer']),
              brand: toStr(r['Brand']),
            },
          },
          upsert: true,
        },
      });
    }

    salesOps.push({
      updateOne: {
        filter: { invoiceNumber, itemNumber },
        update: {
          $set: {
            client: toStr(r['Client']),
            producer: toStr(r['Producer']),
            brand: toStr(r['Brand']),
            itemNumber,
            itemDescription: toStr(r['Item Description']),
            customerNumber: toStr(r['Customer #']),
            customerName: toStr(r['Customer Name']),
            city: toStr(r['City']),
            state: toStr(r['State']),
            invoiceNumber,
            invoiceDate,
            period: period ?? invoiceDate,
            TYTD: toNumber(r['TYTD']),
            LYTD: toNumber(r['LYTD']),
            TMTD: toNumber(r['TMTD']),
            LMTD: toNumber(r['LMTD']),
            cases: toNumber(r['Cases']),
            ytdCases: toNumber(r['YTD Cases']),
            lytdCases: toNumber(r['LYTD Cases']),
            mtdCases: toNumber(r['MTD Cases']),
            lmtdCases: toNumber(r['LMTD Cases']),
            sales: toNumber(r['Sales']),
            ytdSales: toNumber(r['YTD Sales']),
            lytdSales: toNumber(r['LYTD Sales']),
            mtdSales: toNumber(r['MTD Sales']),
            lmtdSales: toNumber(r['LMTD Sales']),
            ytdGrossProfit: toNumber(r['YTD GP$']),
          },
        },
        upsert: true,
      },
    });
  }

  if (itemOps.size) {
    const res = await Item.bulkWrite(Array.from(itemOps.values()), { ordered: false });
    console.log(`✅ Items upserted: ${res.upsertedCount}, modified: ${res.modifiedCount}`);
  }
  if (salesOps.length) {
    const res = await Sales.bulkWrite(salesOps, { ordered: false });
    console.log(`✅ Sales upserted: ${res.upsertedCount}, modified: ${res.modifiedCount}`);
  }
  if (skipped) console.log(`   (skipped ${skipped} rows missing item/invoice/date)`);
}

async function importInventory() {
  const rows = readCsv<InventoryRow>(INVENTORY_CSV);
  console.log(`→ Parsed ${rows.length} inventory rows from ${path.basename(INVENTORY_CSV)}`);

  // Snapshot date = today at UTC midnight (so all rows from this import share a snapshot).
  const now = new Date();
  const snapshotDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const itemOps = new Map<string, any>();
  const invOps: any[] = [];
  let skipped = 0;

  for (const r of rows) {
    const itemNumber = toStr(r['Item #']);
    const location = toStr(r['Location']);
    if (!itemNumber || !location) {
      skipped++;
      continue;
    }

    const itemSku = toStr(r['Item SKU']);
    if (!itemOps.has(itemNumber)) {
      itemOps.set(itemNumber, {
        updateOne: {
          filter: { itemNumber },
          update: {
            $set: {
              itemNumber,
              itemDescription: toStr(r['Item Description']),
              itemSku,
            },
          },
          upsert: true,
        },
      });
    }

    invOps.push({
      updateOne: {
        filter: { location, itemNumber, snapshotDate },
        update: {
          $set: {
            location,
            itemSku,
            itemNumber,
            itemDescription: toStr(r['Item Description']),
            onHand: toNumber(r['On Hand']),
            allocated: toNumber(r['Allocated']),
            available: toNumber(r['Available']),
            onOrder: toNumber(r['On Order']),
            ytdCases: toNumber(r['YTD Cases']),
            mtdCases: toNumber(r['MTD Cases']),
            last30DayCases: toNumber(r['30 Day Cases']),
            last60DayCases: toNumber(r['60 Day Cases']),
            last90DayCases: toNumber(r['90 Day Cases']),
            onHandValue: toNumber(r['On Hand $']),
            snapshotDate,
          },
        },
        upsert: true,
      },
    });
  }

  if (itemOps.size) {
    const res = await Item.bulkWrite(Array.from(itemOps.values()), { ordered: false });
    console.log(`✅ Items upserted: ${res.upsertedCount}, modified: ${res.modifiedCount}`);
  }
  if (invOps.length) {
    const res = await Inventory.bulkWrite(invOps, { ordered: false });
    console.log(`✅ Inventory upserted: ${res.upsertedCount}, modified: ${res.modifiedCount}`);
  }
  if (skipped) console.log(`   (skipped ${skipped} rows missing location/item)`);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI missing in .env');
    process.exit(1);
  }

  console.log('→ Connecting to MongoDB...');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
  console.log(`✅ Connected to DB: ${mongoose.connection.db?.databaseName}`);

  try {
    await importSales();
    await importInventory();

    const [itemCount, salesCount, invCount] = await Promise.all([
      Item.countDocuments(),
      Sales.countDocuments(),
      Inventory.countDocuments(),
    ]);
    console.log('\n📊 Collection totals:');
    console.log(`   items:     ${itemCount}`);
    console.log(`   sales:     ${salesCount}`);
    console.log(`   inventory: ${invCount}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
