import { IProduct } from "../db/models/product";

export default async function createProduct(args: IProduct): Promise<void> {
  console.log("CREATING PRODUCT...");
  console.log(args);
}
