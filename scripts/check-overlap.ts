import 'dotenv/config';
import mongoose from 'mongoose';
import { Sales } from '../models/Sales';
import { Inventory } from '../models/Inventory';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 15000 });

  const salesItems = await Sales.distinct('itemNumber');
  const invItems = await Inventory.distinct('itemNumber');
  const invSet = new Set(invItems);
  const salesSet = new Set(salesItems);

  const inBoth = salesItems.filter((i) => invSet.has(i));
  const salesOnly = salesItems.filter((i) => !invSet.has(i));
  const invOnly = invItems.filter((i) => !salesSet.has(i));

  console.log('🔗 Item # overlap between Sales and Inventory');
  console.log(`   Unique items in sales:     ${salesItems.length}`);
  console.log(`   Unique items in inventory: ${invItems.length}`);
  console.log(`   In both:                   ${inBoth.length}`);
  console.log(`   Sales only:                ${salesOnly.length}`);
  console.log(`   Inventory only:            ${invOnly.length}`);
  if (inBoth.length) console.log(`   Sample matches: ${inBoth.slice(0, 5).join(', ')}`);

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
