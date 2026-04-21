import 'dotenv/config';
import mongoose from 'mongoose';
import { Sales } from '../models/Sales';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 15000 });

  const min = await Sales.findOne().sort({ invoiceDate: 1 }).lean();
  const max = await Sales.findOne().sort({ invoiceDate: -1 }).lean();

  const years = await Sales.aggregate([
    { $group: { _id: { $year: '$invoiceDate' }, count: { $sum: 1 }, totalSales: { $sum: '$sales' }, totalCases: { $sum: '$cases' } } },
    { $sort: { _id: 1 } },
  ]);

  console.log('earliest:', min?.invoiceDate);
  console.log('latest:  ', max?.invoiceDate);
  console.log('by year:', years);

  await mongoose.disconnect();
}
main().catch(console.error);
