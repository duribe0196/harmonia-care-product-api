import * as dotenv from "dotenv";
dotenv.config();
import { APIGatewayEvent, Context, Callback } from "aws-lambda";
import { getNotFoundResponse } from "./utils";
import createProduct from "./http/create-product";
import getProducts from "./http/get-products";
import connectDB from "./db";

export const handleHttpRequests = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  const httpMethod = event.httpMethod;
  const path = event.path;
  console.log(
    `handleHttpRequests - Received method ${httpMethod} in the path ${path}`,
  );
  // Attempt to parse the request body if present
  let requestBody;
  if (event.body) {
    try {
      requestBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid JSON format in request body.",
        }),
      };
    }
  }

  const resource = `${httpMethod}-${path}`;
  await connectDB();
  switch (resource) {
    case "POST-/product/create":
      const name = requestBody.name;
      const price = requestBody.price;
      const description = requestBody.description;
      const stock = requestBody.stock;
      const userSub = event.requestContext.authorizer?.claims?.sub;
      return await createProduct(
        {
          name,
          description,
          price,
          stock,
        },
        userSub,
      );

    case "GET-/product":
      return await getProducts(event);

    default:
      return getNotFoundResponse(path, httpMethod);
  }
};
