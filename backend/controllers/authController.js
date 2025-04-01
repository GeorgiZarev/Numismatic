import { validationResult } from "express-validator";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwtUtils.js";
import BadRequestError from "../errors/BadRequestError.js";

import { Users } from "../utils/db/users.js";

export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await Users.getByEmail(email);
    if (existingUser.length > 0) {
      throw new BadRequestError("User already exists.");
    }

    const hashedPassword = await hashPassword(password);
    const registerUser = {
      username,
      email,
      password: hashedPassword,
    };

    const [newUser] = await Users.create(registerUser);

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const [user] = await Users.getByUsername(username);
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
