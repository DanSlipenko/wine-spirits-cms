"use client";

import * as React from "react";
import { ConfigProvider, Tag } from "antd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/animate-ui/components/radix/sheet";
import { Button as UiButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wine, GlassWater, Package2, MapPin, Grape, Calendar, Barcode, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type WineProductRow = {
  id: string;
  sku: string;
  name: string;
  producer: string;
  category: "Red Wine" | "White Wine" | "Rosé" | "Sparkling" | "Whiskey" | "Vodka" | "Gin" | "Rum" | "Tequila";
  region: string;
  country: string;
  vintage: number | null;
  size: string;
  abv: number;
  unitCost: number;
  unitPrice: number;
  onHand: number;
  allocated: number;
  available: number;
  onOrder: number;
  status: "Active" | "Low Stock" | "Out of Stock" | "Discontinued";
  tastingNotes: string;
  pairings: string;
};

const MOCK: WineProductRow[] = [
  {
    id: "1",
    sku: "WN-FR-1042",
    name: "Château Margaux",
    producer: "Château Margaux",
    category: "Red Wine",
    region: "Bordeaux",
    country: "France",
    vintage: 2015,
    size: "750ml",
    abv: 13.5,
    unitCost: 620.0,
    unitPrice: 899.0,
    onHand: 48,
    allocated: 6,
    available: 42,
    onOrder: 24,
    status: "Active",
    tastingNotes:
      "Elegant bouquet of blackcurrant, violet, and cedar, with refined tannins and a long, velvety finish.",
    pairings: "Grilled ribeye, lamb, aged hard cheeses",
  },
  {
    id: "2",
    sku: "WN-IT-2091",
    name: "Barolo Riserva",
    producer: "Giacomo Conterno",
    category: "Red Wine",
    region: "Piedmont",
    country: "Italy",
    vintage: 2016,
    size: "750ml",
    abv: 14.5,
    unitCost: 320.0,
    unitPrice: 479.0,
    onHand: 62,
    allocated: 12,
    available: 50,
    onOrder: 36,
    status: "Active",
    tastingNotes: "Dried rose petals, tar, black cherry, and leather with firm tannins and high acidity.",
    pairings: "Braised short rib, truffle pasta, wild mushroom risotto",
  },
  {
    id: "3",
    sku: "WN-FR-3320",
    name: "Sancerre Blanc",
    producer: "Domaine Vacheron",
    category: "White Wine",
    region: "Loire Valley",
    country: "France",
    vintage: 2022,
    size: "750ml",
    abv: 13.0,
    unitCost: 32.5,
    unitPrice: 54.0,
    onHand: 184,
    allocated: 24,
    available: 160,
    onOrder: 60,
    status: "Active",
    tastingNotes: "Bright citrus, gooseberry, and flint with crisp minerality.",
    pairings: "Goat cheese, oysters, herb-roasted chicken",
  },
  {
    id: "4",
    sku: "WN-FR-4401",
    name: "Champagne Brut Réserve",
    producer: "Louis Roederer",
    category: "Sparkling",
    region: "Champagne",
    country: "France",
    vintage: null,
    size: "750ml",
    abv: 12.0,
    unitCost: 48.0,
    unitPrice: 79.0,
    onHand: 240,
    allocated: 40,
    available: 200,
    onOrder: 120,
    status: "Active",
    tastingNotes: "Fresh pear, brioche, citrus zest, with a fine, persistent mousse.",
    pairings: "Caviar, sushi, fried chicken, celebrations",
  },
  {
    id: "5",
    sku: "WN-US-5502",
    name: "Cabernet Sauvignon",
    producer: "Caymus Vineyards",
    category: "Red Wine",
    region: "Napa Valley",
    country: "USA",
    vintage: 2020,
    size: "750ml",
    abv: 14.8,
    unitCost: 68.0,
    unitPrice: 109.0,
    onHand: 96,
    allocated: 18,
    available: 78,
    onOrder: 48,
    status: "Active",
    tastingNotes: "Ripe blackberry, cocoa, vanilla, and baking spice with plush tannins.",
    pairings: "Grilled steak, burgers, dark chocolate desserts",
  },
  {
    id: "6",
    sku: "WN-NZ-6610",
    name: "Sauvignon Blanc",
    producer: "Cloudy Bay",
    category: "White Wine",
    region: "Marlborough",
    country: "New Zealand",
    vintage: 2023,
    size: "750ml",
    abv: 13.5,
    unitCost: 22.0,
    unitPrice: 36.0,
    onHand: 9,
    allocated: 4,
    available: 5,
    onOrder: 144,
    status: "Low Stock",
    tastingNotes: "Passion fruit, lime, fresh-cut grass, and bell pepper with zippy acidity.",
    pairings: "Ceviche, green salads, grilled white fish",
  },
  {
    id: "7",
    sku: "SP-SC-7720",
    name: "Macallan 18 Sherry Oak",
    producer: "The Macallan",
    category: "Whiskey",
    region: "Speyside",
    country: "Scotland",
    vintage: null,
    size: "750ml",
    abv: 43.0,
    unitCost: 280.0,
    unitPrice: 429.0,
    onHand: 0,
    allocated: 0,
    available: 0,
    onOrder: 24,
    status: "Out of Stock",
    tastingNotes: "Dried fruits, ginger, orange, clove, and rich oak with a long, warming finish.",
    pairings: "Dark chocolate, blue cheese, smoked almonds",
  },
  {
    id: "8",
    sku: "SP-US-8801",
    name: "Buffalo Trace Bourbon",
    producer: "Buffalo Trace Distillery",
    category: "Whiskey",
    region: "Kentucky",
    country: "USA",
    vintage: null,
    size: "750ml",
    abv: 45.0,
    unitCost: 18.0,
    unitPrice: 34.0,
    onHand: 312,
    allocated: 42,
    available: 270,
    onOrder: 144,
    status: "Active",
    tastingNotes: "Vanilla, brown sugar, toffee, and oak with a smooth, sweet finish.",
    pairings: "BBQ, pecan pie, cocktails (Old Fashioned, Mint Julep)",
  },
  {
    id: "9",
    sku: "SP-FR-9912",
    name: "Grey Goose Vodka",
    producer: "Grey Goose",
    category: "Vodka",
    region: "Cognac",
    country: "France",
    vintage: null,
    size: "1L",
    abv: 40.0,
    unitCost: 26.0,
    unitPrice: 42.0,
    onHand: 420,
    allocated: 60,
    available: 360,
    onOrder: 0,
    status: "Active",
    tastingNotes: "Clean, soft wheat, subtle almond and citrus with a silky finish.",
    pairings: "Martinis, Moscow Mules, caviar service",
  },
  {
    id: "10",
    sku: "SP-UK-1103",
    name: "Hendrick's Gin",
    producer: "Hendrick's",
    category: "Gin",
    region: "Ayrshire",
    country: "Scotland",
    vintage: null,
    size: "750ml",
    abv: 44.0,
    unitCost: 24.0,
    unitPrice: 39.0,
    onHand: 156,
    allocated: 28,
    available: 128,
    onOrder: 72,
    status: "Active",
    tastingNotes: "Cucumber, rose petal, juniper, and coriander with a refreshing, floral profile.",
    pairings: "G&T with cucumber, gin gimlet, light seafood",
  },
  {
    id: "11",
    sku: "SP-MX-1204",
    name: "Clase Azul Reposado",
    producer: "Clase Azul",
    category: "Tequila",
    region: "Jalisco",
    country: "Mexico",
    vintage: null,
    size: "750ml",
    abv: 40.0,
    unitCost: 95.0,
    unitPrice: 149.0,
    onHand: 72,
    allocated: 10,
    available: 62,
    onOrder: 48,
    status: "Active",
    tastingNotes: "Cooked agave, vanilla, cinnamon, and toasted oak with a creamy texture.",
    pairings: "Slow-cooked pork, dark chocolate, aged cheeses",
  },
  {
    id: "12",
    sku: "WN-PT-1305",
    name: "Vintage Port",
    producer: "Taylor Fladgate",
    category: "Red Wine",
    region: "Douro Valley",
    country: "Portugal",
    vintage: 2017,
    size: "750ml",
    abv: 20.0,
    unitCost: 110.0,
    unitPrice: 179.0,
    onHand: 4,
    allocated: 0,
    available: 4,
    onOrder: 0,
    status: "Low Stock",
    tastingNotes: "Blackberry, fig, licorice, and dark chocolate with a rich, sweet finish.",
    pairings: "Stilton, dark chocolate truffles, nuts",
  },
  {
    id: "13",
    sku: "WN-FR-1406",
    name: "Provence Rosé",
    producer: "Château d'Esclans",
    category: "Rosé",
    region: "Provence",
    country: "France",
    vintage: 2023,
    size: "750ml",
    abv: 13.5,
    unitCost: 18.0,
    unitPrice: 32.0,
    onHand: 208,
    allocated: 32,
    available: 176,
    onOrder: 96,
    status: "Active",
    tastingNotes: "Strawberry, white peach, citrus zest, and a crisp, dry finish.",
    pairings: "Salade niçoise, grilled shrimp, charcuterie",
  },
  {
    id: "14",
    sku: "SP-CB-1507",
    name: "Diplomático Reserva Exclusiva",
    producer: "Destilerías Unidas",
    category: "Rum",
    region: "Barinas",
    country: "Venezuela",
    vintage: null,
    size: "750ml",
    abv: 40.0,
    unitCost: 28.0,
    unitPrice: 44.0,
    onHand: 84,
    allocated: 12,
    available: 72,
    onOrder: 48,
    status: "Active",
    tastingNotes: "Caramel, dried fruit, maple, and toasted oak with a smooth, honeyed finish.",
    pairings: "Grilled pineapple, crème brûlée, aged cheddar",
  },
  {
    id: "15",
    sku: "WN-IT-1608",
    name: "Prosecco Superiore DOCG",
    producer: "Nino Franco",
    category: "Sparkling",
    region: "Valdobbiadene",
    country: "Italy",
    vintage: null,
    size: "750ml",
    abv: 11.5,
    unitCost: 14.0,
    unitPrice: 24.0,
    onHand: 0,
    allocated: 0,
    available: 0,
    onOrder: 0,
    status: "Discontinued",
    tastingNotes: "Green apple, pear, white flowers, with a fresh, lively mousse.",
    pairings: "Brunch, light appetizers, aperitifs",
  },
  {
    id: "16",
    sku: "WN-ES-1709",
    name: "Rioja Gran Reserva",
    producer: "Marqués de Riscal",
    category: "Red Wine",
    region: "Rioja",
    country: "Spain",
    vintage: 2014,
    size: "750ml",
    abv: 14.0,
    unitCost: 42.0,
    unitPrice: 69.0,
    onHand: 72,
    allocated: 8,
    available: 64,
    onOrder: 36,
    status: "Active",
    tastingNotes: "Leather, dried cherry, tobacco, and vanilla with polished tannins.",
    pairings: "Lamb chops, manchego, paella",
  },
  {
    id: "17",
    sku: "WN-DE-1810",
    name: "Riesling Kabinett",
    producer: "Dr. Loosen",
    category: "White Wine",
    region: "Mosel",
    country: "Germany",
    vintage: 2022,
    size: "750ml",
    abv: 8.5,
    unitCost: 16.0,
    unitPrice: 26.0,
    onHand: 132,
    allocated: 18,
    available: 114,
    onOrder: 48,
    status: "Active",
    tastingNotes: "Green apple, lime, white peach, and slate minerality with off-dry balance.",
    pairings: "Thai curry, sushi, pork belly",
  },
  {
    id: "18",
    sku: "SP-IE-1911",
    name: "Redbreast 12 Year",
    producer: "Redbreast",
    category: "Whiskey",
    region: "Cork",
    country: "Ireland",
    vintage: null,
    size: "750ml",
    abv: 40.0,
    unitCost: 52.0,
    unitPrice: 79.0,
    onHand: 48,
    allocated: 8,
    available: 40,
    onOrder: 24,
    status: "Active",
    tastingNotes: "Honey, toasted nuts, marmalade, and sherry with a creamy, pot-still character.",
    pairings: "Smoked salmon, crème brûlée, dark chocolate",
  },
  {
    id: "19",
    sku: "WN-AR-2012",
    name: "Malbec Reserva",
    producer: "Catena Zapata",
    category: "Red Wine",
    region: "Mendoza",
    country: "Argentina",
    vintage: 2021,
    size: "750ml",
    abv: 13.5,
    unitCost: 19.0,
    unitPrice: 32.0,
    onHand: 168,
    allocated: 22,
    available: 146,
    onOrder: 96,
    status: "Active",
    tastingNotes: "Blueberry, plum, violet, and mocha with silky tannins.",
    pairings: "Grilled beef, empanadas, chimichurri",
  },
  {
    id: "20",
    sku: "WN-US-2113",
    name: "Chardonnay Reserve",
    producer: "Kistler Vineyards",
    category: "White Wine",
    region: "Sonoma Coast",
    country: "USA",
    vintage: 2021,
    size: "750ml",
    abv: 14.2,
    unitCost: 58.0,
    unitPrice: 94.0,
    onHand: 7,
    allocated: 2,
    available: 5,
    onOrder: 36,
    status: "Low Stock",
    tastingNotes: "Lemon curd, brioche, toasted hazelnut, and crushed stone.",
    pairings: "Lobster, roasted chicken, creamy pasta",
  },
];

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const formatInt = (n: number) => new Intl.NumberFormat("en-US").format(n);

const categoryColor: Record<WineProductRow["category"], string> = {
  "Red Wine": "magenta",
  "White Wine": "gold",
  "Rosé": "pink",
  "Sparkling": "geekblue",
  "Whiskey": "volcano",
  "Vodka": "blue",
  "Gin": "cyan",
  "Rum": "orange",
  "Tequila": "green",
};

const statusColor: Record<WineProductRow["status"], string> = {
  Active: "green",
  "Low Stock": "orange",
  "Out of Stock": "red",
  Discontinued: "default",
};

// Visual styling for the product "bottle" artwork on each card.
// Gradient + bottle color are keyed to category.
const categoryArt: Record<
  WineProductRow["category"],
  { bg: string; bottle: string; liquid: string; label: string }
> = {
  "Red Wine": {
    bg: "from-rose-100 via-rose-50 to-white",
    bottle: "bg-gradient-to-b from-emerald-900 to-emerald-950",
    liquid: "bg-gradient-to-b from-red-800 to-red-950",
    label: "bg-stone-100 text-stone-800 border-stone-300",
  },
  "White Wine": {
    bg: "from-amber-50 via-yellow-50 to-white",
    bottle: "bg-gradient-to-b from-lime-800/80 to-lime-900/80",
    liquid: "bg-gradient-to-b from-amber-200 to-amber-400",
    label: "bg-amber-50 text-amber-900 border-amber-200",
  },
  "Rosé": {
    bg: "from-pink-100 via-rose-50 to-white",
    bottle: "bg-gradient-to-b from-zinc-200 to-zinc-300",
    liquid: "bg-gradient-to-b from-rose-300 to-pink-400",
    label: "bg-pink-50 text-pink-900 border-pink-200",
  },
  Sparkling: {
    bg: "from-yellow-100 via-amber-50 to-white",
    bottle: "bg-gradient-to-b from-emerald-950 to-black",
    liquid: "bg-gradient-to-b from-yellow-200 to-amber-300",
    label: "bg-yellow-50 text-yellow-900 border-yellow-200",
  },
  Whiskey: {
    bg: "from-amber-100 via-orange-50 to-white",
    bottle: "bg-gradient-to-b from-amber-800/40 to-amber-900/60",
    liquid: "bg-gradient-to-b from-amber-500 to-amber-800",
    label: "bg-orange-50 text-orange-900 border-orange-200",
  },
  Vodka: {
    bg: "from-sky-100 via-blue-50 to-white",
    bottle: "bg-gradient-to-b from-sky-100 to-sky-200",
    liquid: "bg-gradient-to-b from-white to-sky-50",
    label: "bg-sky-50 text-sky-900 border-sky-200",
  },
  Gin: {
    bg: "from-emerald-100 via-teal-50 to-white",
    bottle: "bg-gradient-to-b from-emerald-800 to-emerald-950",
    liquid: "bg-gradient-to-b from-emerald-100 to-emerald-200",
    label: "bg-emerald-50 text-emerald-900 border-emerald-200",
  },
  Rum: {
    bg: "from-orange-100 via-amber-50 to-white",
    bottle: "bg-gradient-to-b from-zinc-100 to-zinc-200",
    liquid: "bg-gradient-to-b from-amber-600 to-amber-900",
    label: "bg-amber-50 text-amber-900 border-amber-200",
  },
  Tequila: {
    bg: "from-lime-100 via-emerald-50 to-white",
    bottle: "bg-gradient-to-b from-zinc-100 to-zinc-200",
    liquid: "bg-gradient-to-b from-amber-100 to-amber-300",
    label: "bg-lime-50 text-lime-900 border-lime-200",
  },
};

function BottleArt({ product }: { product: WineProductRow }) {
  const art = categoryArt[product.category];
  const initials = product.producer
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className={cn("relative flex h-56 items-end justify-center overflow-hidden bg-gradient-to-b", art.bg)}>
      {/* Subtle back-glow */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/5 to-transparent" />

      {/* Bottle */}
      <div className="relative flex flex-col items-center pb-3">
        {/* Cap */}
        <div className="h-4 w-6 rounded-t-sm bg-zinc-900/80" />
        {/* Neck */}
        <div className={cn("h-9 w-4", art.bottle)} />
        {/* Shoulders (flare) */}
        <div className={cn("h-4 w-12 rounded-t-[12px]", art.bottle)} />
        {/* Body */}
        <div className={cn("relative flex h-36 w-16 items-center justify-center rounded-b-[12px] rounded-t-sm shadow-md", art.bottle)}>
          {/* Liquid fill visible for clear/light bottles */}
          {(product.category === "Vodka" || product.category === "Gin" || product.category === "Rum" || product.category === "Tequila" || product.category === "Rosé") && (
            <div className={cn("absolute inset-x-1 bottom-1 top-2 rounded-b-[10px] rounded-t-sm opacity-80", art.liquid)} />
          )}
          {/* Label */}
          <div className={cn("relative z-10 mx-1 flex h-18 w-full flex-col items-center justify-center rounded-[3px] border text-[11px] leading-tight", art.label)}>
            <span className="font-serif text-[13px] font-bold tracking-wide">{initials}</span>
            {product.vintage && <span className="mt-0.5 text-[9px] opacity-70">{product.vintage}</span>}
          </div>
          {/* Highlight shine */}
          <div className="pointer-events-none absolute inset-y-2 left-1 w-1 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: WineProductRow; onClick: () => void }) {
  const isUnavailable = product.status === "Out of Stock" || product.status === "Discontinued";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border bg-white text-left transition-all",
        "hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "dark:border-zinc-800 dark:bg-zinc-950",
        isUnavailable && "opacity-80",
      )}>
      <div className="relative">
        <BottleArt product={product} />
        <div className="absolute left-2 top-2">
          <Tag color={categoryColor[product.category]} className="!m-0">
            {product.category}
          </Tag>
        </div>
        <div className="absolute right-2 top-2">
          <Tag color={statusColor[product.status]} className="!m-0">
            {product.status}
          </Tag>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 border-t p-4 dark:border-zinc-800">
        <div className="min-h-[48px]">
          <div className="line-clamp-2 text-base font-semibold leading-tight text-zinc-900 dark:text-zinc-50">
            {product.name}
          </div>
          <div className="mt-1 line-clamp-1 text-sm text-zinc-500">{product.producer}</div>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="line-clamp-1">
            {product.region}, {product.country}
          </span>
          <span className="shrink-0">{product.size}</span>
        </div>

        <div className="mt-1 flex items-end justify-between border-t pt-3 dark:border-zinc-800">
          <div>
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">Price</div>
            <div className="text-lg font-semibold text-blue-600">{formatCurrency(product.unitPrice)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wide text-zinc-500">On Hand</div>
            <div
              className={cn(
                "text-lg font-semibold",
                product.onHand === 0
                  ? "text-rose-600"
                  : product.status === "Low Stock"
                    ? "text-amber-600"
                    : "text-zinc-900 dark:text-zinc-100",
              )}>
              {formatInt(product.onHand)}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

const CATEGORY_FILTERS: (WineProductRow["category"] | "All")[] = [
  "All",
  "Red Wine",
  "White Wine",
  "Rosé",
  "Sparkling",
  "Whiskey",
  "Vodka",
  "Gin",
  "Rum",
  "Tequila",
];

export function WineInventoryTable() {
  const [selected, setSelected] = React.useState<WineProductRow | null>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<WineProductRow["category"] | "All">("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.producer.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const handleSelect = (row: WineProductRow) => {
    setSelected(row);
    setOpen(true);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          borderRadius: 4,
        },
      }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-zinc-400" strokeWidth={1.5} />
            <Input
              placeholder="Search by product, producer, SKU, region…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_FILTERS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400",
                )}>
                {c}
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-zinc-500">
            Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filtered.length}</span> of {MOCK.length} products
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex min-h-[240px] items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            No products match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => handleSelect(p)} />
            ))}
          </div>
        )}
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[480px] sm:w-[540px] sm:max-w-[540px]">
          {selected && (
            <>
              <SheetHeader className="border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    {selected.category.includes("Wine") || selected.category === "Sparkling" || selected.category === "Rosé" ? (
                      <Wine className="size-5" strokeWidth={1.5} />
                    ) : (
                      <GlassWater className="size-5" strokeWidth={1.5} />
                    )}
                  </div>
                  <div className="flex-1">
                    <SheetTitle className="text-lg leading-tight">{selected.name}</SheetTitle>
                    <SheetDescription className="mt-0.5">{selected.producer}</SheetDescription>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Tag color={categoryColor[selected.category]}>{selected.category}</Tag>
                      <Tag color={statusColor[selected.status]}>{selected.status}</Tag>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4">
                <div className="overflow-hidden rounded-sm border">
                  <BottleArt product={selected} />
                </div>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <DetailStat icon={Barcode} label="SKU" value={selected.sku} mono />
                  <DetailStat icon={Calendar} label="Vintage" value={selected.vintage ? String(selected.vintage) : "Non-Vintage"} />
                  <DetailStat icon={MapPin} label="Region" value={`${selected.region}, ${selected.country}`} />
                  <DetailStat icon={Package2} label="Size" value={`${selected.size} · ${selected.abv.toFixed(1)}% ABV`} />
                </div>

                <div className="grid grid-cols-2 gap-3 border-t pt-4">
                  <PriceBlock label="Unit Cost" value={formatCurrency(selected.unitCost)} />
                  <PriceBlock label="Unit Price" value={formatCurrency(selected.unitPrice)} highlight />
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 border-t pt-4">
                  <StockStat label="On Hand" value={selected.onHand} />
                  <StockStat label="Allocated" value={selected.allocated} />
                  <StockStat label="Available" value={selected.available} tone="positive" />
                  <StockStat label="On Order" value={selected.onOrder} />
                </div>

                <div className="mt-5 border-t pt-4">
                  <SectionLabel icon={Grape}>Tasting Notes</SectionLabel>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {selected.tastingNotes}
                  </p>
                </div>

                <div className="mt-4 border-t pt-4 pb-2">
                  <SectionLabel>Food Pairings</SectionLabel>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    {selected.pairings}
                  </p>
                </div>
              </div>

              <SheetFooter className="border-t">
                <div className="flex w-full items-center justify-end gap-2">
                  <SheetClose asChild>
                    <UiButton variant="outline">Close</UiButton>
                  </SheetClose>
                  <UiButton>Edit Product</UiButton>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </ConfigProvider>
  );
}

function DetailStat({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
        <Icon className="size-3.5" strokeWidth={1.5} />
        {label}
      </div>
      <div className={mono ? "font-mono text-sm text-zinc-900 dark:text-zinc-100" : "text-sm text-zinc-900 dark:text-zinc-100"}>
        {value}
      </div>
    </div>
  );
}

function PriceBlock({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-sm border bg-zinc-50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className={`mt-1 text-xl font-semibold ${highlight ? "text-blue-600" : "text-zinc-900 dark:text-zinc-100"}`}>
        {value}
      </div>
    </div>
  );
}

function StockStat({ label, value, tone = "neutral" }: { label: string; value: number; tone?: "neutral" | "positive" }) {
  const color = tone === "positive" ? "text-emerald-600" : "text-zinc-900 dark:text-zinc-100";
  return (
    <div className="flex flex-col items-center rounded-sm border bg-white px-2 py-2 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <div className={`text-lg font-semibold ${color}`}>{formatInt(value)}</div>
      <div className="text-[11px] text-zinc-500">{label}</div>
    </div>
  );
}

function SectionLabel({
  icon: Icon,
  children,
}: {
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
      {Icon && <Icon className="size-3.5" strokeWidth={1.5} />}
      {children}
    </div>
  );
}
