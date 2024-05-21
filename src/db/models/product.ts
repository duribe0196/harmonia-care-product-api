import mongoose, { Document, Schema } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
}

type IProductDocument = IProduct & Document;

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default mongoose.model<IProductDocument>("Product", productSchema);
