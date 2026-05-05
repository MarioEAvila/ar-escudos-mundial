import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectDatabase() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is required to run the backend.");
  }

  await mongoose.connect(env.mongoUri);
}
