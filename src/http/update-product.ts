import Product, { IProduct } from "../db/models/product";
import User, { UserRole } from "../db/models/user";
import { Price } from "./Price";
import { MongoError } from "./common";

interface IUpdateProductArgs {
  productData: Omit<IProduct, "createdBy" | "id">;
  userSub: string;
  productId: string;
}

export default async function updateProduct(
  args: IUpdateProductArgs,
): Promise<{ body: string; statusCode: number }> {
  const {
    productData: { name, description, price, stock },
    productId,
    userSub,
  } = args;
  console.log("update product - updating product", name);

  try {
    const user = await User.findOne({ sub: userSub });
    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    if (user.role != UserRole.OWNER) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "User does not have privileges to update a product",
        }),
      };
    }

    const productFound = await Product.findById(productId);
    if (!productFound) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Product does not exists" }),
      };
    }

    productFound.price = new Price(price.amount);
    productFound.name = name;
    productFound.description = description;
    productFound.stock = stock;
    const productUpdated = await productFound.save();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Product updated successfully",
        product: productUpdated,
      }),
    };
  } catch (e: unknown) {
    console.error(e);
    const mongoError = e as MongoError;
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating product" }),
    };
  }
}
