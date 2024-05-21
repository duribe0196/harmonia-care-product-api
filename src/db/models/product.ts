import mongoose, { Document, Schema } from "mongoose";

export interface IPrice {
  amount: number;
  currency: string;
}

export interface IProduct {
  name: string;
  description: string;
  price: IPrice;
  stock: number;
}

type IProductDocument = IProduct & Document;

const priceSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
});

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: priceSchema, required: true },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IProductDocument>("Product", productSchema);
