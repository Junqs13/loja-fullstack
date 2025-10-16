// config/database.js

import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      
    });

    console.info(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};