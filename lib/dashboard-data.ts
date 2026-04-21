import { connectToDatabase } from '@/lib/mongodb';
import { Sales } from '@/models';

export type Kpi = {
  ytdSales: number;
  lytdSales: number;
  salesYoyAbs: number;
  salesYoyPct: number;

  ytdCases: number;
  lytdCases: number;
  casesYoyAbs: number;
  casesYoyPct: number;
};

export type MonthlyPoint = {
  month: string;
  currentYearSales: number;
  lastYearSales: number;
};

export type DashboardData = {
  kpi: Kpi;
  monthly: MonthlyPoint[];
  currentYear: number;
  lastYear: number;
  cutoffDate: Date;
};

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export async function getDashboardData(): Promise<DashboardData> {
  await connectToDatabase();

  const latest = await Sales.findOne().sort({ invoiceDate: -1 }).lean();
  const cutoffDate = latest?.invoiceDate ?? new Date();
  const currentYear = cutoffDate.getUTCFullYear();
  const lastYear = currentYear - 1;

  const startCY = new Date(Date.UTC(currentYear, 0, 1));
  const startLY = new Date(Date.UTC(lastYear, 0, 1));
  const cutoffLY = new Date(
    Date.UTC(
      lastYear,
      cutoffDate.getUTCMonth(),
      cutoffDate.getUTCDate(),
      23, 59, 59, 999,
    ),
  );

  // Aggregate YTD and LYTD totals for sales + cases in a single pipeline.
  const [totals] = await Sales.aggregate<{
    ytdSales: number;
    lytdSales: number;
    ytdCases: number;
    lytdCases: number;
  }>([
    {
      $facet: {
        cy: [
          { $match: { invoiceDate: { $gte: startCY, $lte: cutoffDate } } },
          { $group: { _id: null, sales: { $sum: '$sales' }, cases: { $sum: '$cases' } } },
        ],
        ly: [
          { $match: { invoiceDate: { $gte: startLY, $lte: cutoffLY } } },
          { $group: { _id: null, sales: { $sum: '$sales' }, cases: { $sum: '$cases' } } },
        ],
      },
    },
    {
      $project: {
        ytdSales: { $ifNull: [{ $arrayElemAt: ['$cy.sales', 0] }, 0] },
        ytdCases: { $ifNull: [{ $arrayElemAt: ['$cy.cases', 0] }, 0] },
        lytdSales: { $ifNull: [{ $arrayElemAt: ['$ly.sales', 0] }, 0] },
        lytdCases: { $ifNull: [{ $arrayElemAt: ['$ly.cases', 0] }, 0] },
      },
    },
  ]);

  const t = totals ?? { ytdSales: 0, lytdSales: 0, ytdCases: 0, lytdCases: 0 };

  const salesYoyAbs = t.ytdSales - t.lytdSales;
  const salesYoyPct = t.lytdSales ? (salesYoyAbs / t.lytdSales) * 100 : 0;
  const casesYoyAbs = t.ytdCases - t.lytdCases;
  const casesYoyPct = t.lytdCases ? (casesYoyAbs / t.lytdCases) * 100 : 0;

  // Monthly breakdown for current + last year.
  const monthly = await Sales.aggregate<{
    _id: { year: number; month: number };
    sales: number;
  }>([
    {
      $match: {
        invoiceDate: { $gte: startLY, $lte: cutoffDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$invoiceDate' },
          month: { $month: '$invoiceDate' },
        },
        sales: { $sum: '$sales' },
      },
    },
  ]);

  const currentMonth = cutoffDate.getUTCMonth();
  const monthlyPoints: MonthlyPoint[] = [];
  for (let m = 0; m <= currentMonth; m++) {
    const cy = monthly.find((x) => x._id.year === currentYear && x._id.month === m + 1);
    const ly = monthly.find((x) => x._id.year === lastYear && x._id.month === m + 1);
    monthlyPoints.push({
      month: MONTH_LABELS[m],
      currentYearSales: cy?.sales ?? 0,
      lastYearSales: ly?.sales ?? 0,
    });
  }

  return {
    kpi: {
      ytdSales: t.ytdSales,
      lytdSales: t.lytdSales,
      salesYoyAbs,
      salesYoyPct,
      ytdCases: t.ytdCases,
      lytdCases: t.lytdCases,
      casesYoyAbs,
      casesYoyPct,
    },
    monthly: monthlyPoints,
    currentYear,
    lastYear,
    cutoffDate,
  };
}

export function formatCompact(n: number): string {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}k`;
  return `${sign}${abs.toFixed(0)}`;
}

export function formatPct(n: number): string {
  return `${n >= 0 ? '' : ''}${n.toFixed(1)}%`;
}
