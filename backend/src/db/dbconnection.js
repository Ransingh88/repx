import mongoose from "mongoose"
import { DB_NAME, MONGODB_URI } from "../constant/config.js"

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    )
    console.log(
      `MongoDB connected successfully \n Host: ${connectionInstance.connection.host} \n Port: ${connectionInstance.connection.port} \n Database: ${connectionInstance.connection.name}`
    )
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1) // Exit process with failure
  }
}
