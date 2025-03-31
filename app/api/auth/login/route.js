import { NextResponse } from "next/server"

// Mock database for demonstration
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "TUTOR",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "STUDENT",
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "ADMIN",
  },
]

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find user in mock database
    const user = users.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create a user object without the password
    const { password: _, ...userWithoutPassword } = user

    // Generate a mock token
    const token = `mock-jwt-token-${Date.now()}`

    return NextResponse.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
