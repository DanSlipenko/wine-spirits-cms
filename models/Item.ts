import mongoose, { Schema, Model, InferSchemaType } from 'mongoose';

const itemSchema = new Schema(
  {
    itemNumber: { type: String, required: true, unique: true, index: true, trim: true },
    itemDescription: { type: String, required: true, trim: true },
    itemSku: { type: String, trim: true, default: '' },

    client: { type: String, trim: true, default: '' },
    producer: { type: String, trim: true, default: '' },
    brand: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

export type ItemDoc = InferSchemaType<typeof itemSchema>;

export const Item: Model<ItemDoc> =
  (mongoose.models.Item as Model<ItemDoc>) ||
  mongoose.model<ItemDoc>('Item', itemSchema);
