import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { generateRandomToken } from "../utils/generateRandomToken.js"

const registerUser = async (req, res) => {
  try {
    // Simulate user registration logic
    const { username, password, name, email } = req.body
    if (!username || !password || !name || !email) {
      return res
        .status(400)
        .json({ message: "Username, password, name, and email are required" })
    }
    // save the user to the database
    const user = await User.create({
      username,
      password, // In a real application, ensure to hash the password before saving
      name,
      email,
    })

    if (!user) {
      return res.status(500).json({ message: "User registration failed" })
    }

    res.status(201).json({
      message: "User registered successfully",
      data: user,
    })
  } catch (error) {
    console.error("Error during registration:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ApiError(400, "Validation Error", [
      "Email and password are required",
    ])
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(401, "Authentication Error", [
      "Invalid email or password",
    ])
  }

  if (user.password !== password) {
    throw new ApiError(401, "Authentication Error", [
      "Invalid email or password",
    ])
  }

  const token = generateRandomToken(32)

  if (!token) {
    throw new ApiError(500, "Token Generation Error", [
      "Failed to generate authentication token",
    ])
  }

  user.token = token
  await user.save()
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  res.status(200).json(
    new ApiResponse(200, "Login successful", {
      user: {
        id: user._id,
      },
    })
  )
})

export { registerUser, loginUser }
