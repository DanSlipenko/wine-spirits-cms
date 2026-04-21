import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Inventory } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  await connectToDatabase();
  const docs = await Inventory.find()
    .sort({ onHand: -1 })
    .lean();

  return NextResponse.json(
    docs.map((d) => ({
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
    })),
  );
}
