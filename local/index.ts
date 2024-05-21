import { handleHttpRequests } from "../src/handlers";
import * as createProduct from "./events/create-product";

const eventName = process.argv[3];
let response;
(async () => {
  switch (eventName) {
    case "create-product":
      response = await handleHttpRequests(
        createProduct.event as any,
        createProduct.context as any,
        createProduct.cb,
      );
      console.log("----------RESPONSE-----------\n", response);
      break;

    default:
      break;
  }
})();
