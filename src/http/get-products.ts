import Product from "../db/models/product";
import { APIGatewayEvent } from "aws-lambda";

export default async function getProducts(
  event: APIGatewayEvent,
): Promise<{ body: string; statusCode: number }> {
  try {
    const { queryStringParameters } = event;
    const name = queryStringParameters?.name || "";
    const page = parseInt(<string>queryStringParameters?.page) || 1;
    const limit = parseInt(<string>queryStringParameters?.limit) || 10;
    console.log("Get products - getting products");

    const query: any = {};
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    // Fetch products with pagination
    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Construct response
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: products,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
