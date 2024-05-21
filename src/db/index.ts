import mongoose from "mongoose";
import { getSecrets } from "../secrets";

let isConnected: boolean = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("DB Connection => using existing database connection");
    return;
  }
  const { MONGODB_SECRET_NAME, REGION } = process.env;
  const cognitoSecrets = await getSecrets({
    secretName: MONGODB_SECRET_NAME!,
    region: REGION!,
  });
  console.log("DB Connection => using new database connection");
  await mongoose.connect(cognitoSecrets["mongoDBUri"]);

  isConnected = true;
};

export default connectDB;
