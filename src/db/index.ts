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
  const mongoUser = cognitoSecrets["dbUser"];
  const mongoPassword = cognitoSecrets["dbPassword"];
  const connectionString = cognitoSecrets["connectionString"].replace(
    "mongodb+srv://",
    "",
  );
  const URI = `mongodb+srv://${mongoUser}:${mongoPassword}@${connectionString}`;

  try {
    console.log("DB Connection => using new database connection", URI);
    await mongoose.connect(URI);
    isConnected = true;
  } catch (e) {
    console.error(e);
  }
};

export default connectDB;
