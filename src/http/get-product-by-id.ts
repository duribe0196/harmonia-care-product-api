import Product from "../db/models/product";

export default async function getProductById(
  productId: string | undefined,
): Promise<{ body: string; statusCode: number }> {
  try {
    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Product id is required" }),
      };
    }
    console.log(`Get product - getting product ${productId}`);
    const product = await Product.findById(productId);

    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
