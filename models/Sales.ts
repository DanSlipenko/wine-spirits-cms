import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const salesSchema = new Schema(
  {
    client: { type: String, required: true, trim: true },
    producer: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },

    itemNumber: { type: String, required: true, trim: true, index: true },
    itemDescription: { type: String, required: true, trim: true },

    customerNumber: { type: String, required: true, trim: true, index: true },
    customerName: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },

    invoiceNumber: { type: String, required: true, trim: true, index: true },
    invoiceDate: { type: Date, required: true, index: true },
    period: { type: Date, required: true, index: true },

    TYTD: { type: Number, default: 0 },
    LYTD: { type: Number, default: 0 },
    TMTD: { type: Number, default: 0 },
    LMTD: { type: Number, default: 0 },

    cases: { type: Number, default: 0 },
    ytdCases: { type: Number, default: 0 },
    lytdCases: { type: Number, default: 0 },
    mtdCases: { type: Number, default: 0 },
    lmtdCases: { type: Number, default: 0 },

    sales: { type: Number, default: 0 },
    ytdSales: { type: Number, default: 0 },
    lytdSales: { type: Number, default: 0 },
    mtdSales: { type: Number, default: 0 },
    lmtdSales: { type: Number, default: 0 },

    ytdGrossProfit: { type: Number, default: 0 },
  },
  { timestamps: true },
);

salesSchema.index({ itemNumber: 1, invoiceDate: -1 });
salesSchema.index({ customerNumber: 1, invoiceDate: -1 });
salesSchema.index({ invoiceNumber: 1, itemNumber: 1 }, { unique: true });

export type SalesDoc = InferSchemaType<typeof salesSchema>;

export const Sales: Model<SalesDoc> =
  (mongoose.models.Sales as Model<SalesDoc>) ||
  mongoose.model<SalesDoc>('Sales', salesSchema);
