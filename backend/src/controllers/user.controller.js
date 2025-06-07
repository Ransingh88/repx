import { User } from "../models/user.model.js"

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

export { registerUser }
