import { validationResult } from "express-validator";
import { sql } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwtUtils.js";
import BadRequestError from "../errors/BadRequestError.js";

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError("Validation failed", errors.array()));
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existingUser.length > 0) {
      throw new BadRequestError("User already exists.");
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await sql`
      INSERT INTO users (id, username, email, password) 
      VALUES (uuid_generate_v4(), ${username}, ${email}, ${hashedPassword}) 
      RETURNING id, username, email, created_at
    `;

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError("Validation failed", errors.array()));
  }

  const { username, password } = req.body;

  try {
    const [user] = await sql`SELECT * FROM users WHERE username = ${username}`;
    if (!user) {
      return next(new BadRequestError("Invalid credentials"));
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        id: user.id,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
};
