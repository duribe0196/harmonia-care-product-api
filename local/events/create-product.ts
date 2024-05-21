import { getBaseEvent } from "./base-event";
import { getBaseContext } from "./base-context";
import { IProduct } from "../../src/db/models/product";
const body: IProduct = {
  description: "Some product description",
  name: "Some product name",
  price: {
    currency: "COP",
    amount: 10000,
  },
  stock: 0,
};

const event = getBaseEvent({
  path: "/product/create",
  method: "POST",
  body,
});
const context = getBaseContext();
const cb = (data: any) => data;

export { event, context, cb };
