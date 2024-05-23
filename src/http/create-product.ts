import Product, { IProduct } from "../db/models/product";
import User, { UserRole } from "../db/models/user";
import { Price } from "./Price";
import { MongoError } from "./common";

interface ICreateProductArgs {
  productData: Omit<IProduct, "createdBy" | "id">;
  userSub: string;
}

export default async function createProduct(
  args: ICreateProductArgs,
): Promise<{ body: string; statusCode: number }> {
  const {
    productData: { price, stock, name, description },
    userSub,
  } = args;
  console.log("Create product - creating product", name);

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
          message: "User does not have privileges to create a product",
        }),
      };
    }

    const productPrice = new Price(price.amount);
    const newProduct = new Product({
      name,
      description,
      price: productPrice,
      stock,
      createdBy: user._id,
    });
    const savedProduct = await newProduct.save();
    return {
      statusCode: 200,
      body: JSON.stringify(savedProduct),
    };
  } catch (e: unknown) {
    console.error(e);
    const mongoError = e as MongoError;
    if (mongoError.code === 11000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Product name already exists" }),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error saving product" }),
      };
    }
  }
}
