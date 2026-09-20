const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// ==============================
// REGISTER
// ==============================

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check whether the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Never send the password back to the client
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

// ==============================
// LOGIN
// ==============================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // User doesn't exist
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare entered password with stored hashed password
    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    // Password is incorrect
    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    // Login successful
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


// ==============================
// GET CURRENT USER
// ==============================

const getMe = async (req, res) => {
    try {
      // Get user ID from the verified JWT
      const userId = req.user.userId;
  
      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
  
      // User no longer exists
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      return res.status(200).json({
        user,
      });
    } catch (error) {
      console.error("Get current user error:", error);
  
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  };

// ==============================
// EXPORT CONTROLLERS
// ==============================

module.exports = {
  register,
  login,
  getMe,
};