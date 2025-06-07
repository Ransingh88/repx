import { ApiError } from "../utils/ApiError.js"

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500 // Default to 500 if no status code is set

  console.error(err)

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message) // Extract validation error messages
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Validation Error",
      errors,
    })
  }

  // Handle MongoDB Duplicate Key Errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0] // Get the field causing the duplicate error
    const value = err.keyValue[field] // Get the duplicate value
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: `Duplicate value for field '${field}': '${value}'`,
      errors: [`The value '${value}' for '${field}' must be unique.`],
    })
  }

  // Handle Mongoose Cast Errors
  if (err.name === "CastError") {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: `Invalid value for field '${err.path}': '${err.value}'`,
      errors: [`The value '${err.value}' is not valid for '${err.path}'.`],
    })
  }

  // Handle default errors
  const response = {
    statusCode,
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
  }

  // If the error is an instance of ApiError, include additional data
  if (err instanceof ApiError) {
    response.data = err.data || null
  }

  res.status(statusCode).json(response)
}
