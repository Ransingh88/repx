import dotenv from "dotenv"
import { app } from "./app.js"
import { connectDB } from "./db/dbconnection.js"
import { PORT } from "./constant/config.js"
dotenv.config()

// console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
// console.log(`Port: ${PORT}`)

const startServer = () => {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
      })
    })
    .catch((error) => {
      console.error("Failed to connect to the database:", error)
      process.exit(1) // Exit process with failure
    })
}

startServer()
