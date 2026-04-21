import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const inventorySchema = new Schema(
  {
    location: { type: String, required: true, trim: true, index: true },
    itemSku: { type: String, required: true, trim: true, index: true },

    itemNumber: { type: String, required: true, trim: true, index: true },
    itemDescription: { type: String, required: true, trim: true },

    onHand: { type: Number, default: 0 },
    allocated: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    onOrder: { type: Number, default: 0 },

    ytdCases: { type: Number, default: 0 },
    mtdCases: { type: Number, default: 0 },
    last30DayCases: { type: Number, default: 0 },
    last60DayCases: { type: Number, default: 0 },
    last90DayCases: { type: Number, default: 0 },

    onHandValue: { type: Number, default: 0 },

    snapshotDate: { type: Date, default: () => new Date(), index: true },
  },
  { timestamps: true },
);

inventorySchema.index(
  { location: 1, itemNumber: 1, snapshotDate: -1 },
  { unique: true },
);

export type InventoryDoc = InferSchemaType<typeof inventorySchema>;

export const Inventory: Model<InventoryDoc> =
  (mongoose.models.Inventory as Model<InventoryDoc>) ||
  mongoose.model<InventoryDoc>('Inventory', inventorySchema);
