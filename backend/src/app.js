import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { CORS_ORIGIN } from "./constant/config.js"

// dotenv.config()
dotenv.config({ path: "./.env" })

export const app = express()

// configurations
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
)
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// route imports
import userRoutes from "./routes/user.route.js"
import workoutRoutes from "./routes/workout.route.js"

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/workout", workoutRoutes)
