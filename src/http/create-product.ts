import Product, { IProduct } from "../db/models/product";
import { Price } from "./Price";
import { Callback } from "aws-lambda";
import { MongoError } from "./common";

export default async function createProduct(
  args: IProduct,
  callback: Callback,
): Promise<void> {
  const { price, stock, name, description } = args;
  console.log("create product - creating product", name);
  const productPrice = new Price(price.amount);
  const newProduct = new Product({
    name,
    description,
    price: productPrice,
    stock,
  });
  try {
    const savedProduct = await newProduct.save();
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(savedProduct),
    });
  } catch (e: unknown) {
    const mongoError = e as MongoError;
    if (mongoError.code === 11000) {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({ message: "Product name already exists" }),
      });
    } else {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({ message: "Error saving product" }),
      });
    }
    console.error(mongoError);
  }
}
