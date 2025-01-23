import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const ConnectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DB_URI}/${DB_NAME}`
    );

    console.log(
      `==> 🗄️  DB connected | DB host is ${connectionInstance.connection.host} `
    );
  } catch (error) {
    console.error("An error occurred while connecting db", error);
  }
};
