import { validationResult } from "express-validator";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwtUtils.js";
import BadRequestError from "../errors/BadRequestError.js";

import { Users } from "../utils/db/users.js";
import { Addresses } from "../utils/db/addresses.js";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 2 * 60 * 60 * 1000,
});

export const registerUser = async (req, res, next) => {
  const { email, password, first_name, last_name, birth_date, phone, preferred_language, city, address, postal_code, address_line_2, country } = req.body;

  try {
    const existingUser = await Users.getByEmail(email);
    if (existingUser.length > 0) {
      throw new BadRequestError("User already exists.");
    }

    const hashedPassword = await hashPassword(password);
    const registerUser = {
      email,
      password: hashedPassword,
      full_name: [first_name, last_name].filter(Boolean).join(" ") || null,
      phone: phone || null,
      city: city || null,
      address: address || null,
      birth_date: birth_date ? birth_date.toISOString().slice(0, 10) : null,
      preferred_language: preferred_language || null,
    };

    const [newUser] = await Users.create(registerUser);

    if (city && address && phone && registerUser.full_name) {
      try {
        await Addresses.create(newUser.id, {
          label: "Home",
          full_name: registerUser.full_name,
          phone,
          city,
          address,
          postal_code,
          address_line_2: address_line_2 || "",
          country,
          notes: "",
          is_default: true,
        });
      } catch (error) {
        await Users.remove(newUser.id);
        throw error;
      }
    }

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const [user] = await Users.getByEmail(email);
    if (!user) {
      return next(new BadRequestError("Invalid credentials"));
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.cookie("auth_token", token, getCookieOptions());

    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        id: user.id,
        full_name: user.full_name,
        phone: user.phone,
        city: user.city,
        address: user.address,
        birth_date: user.birth_date,
        preferred_language: user.preferred_language,
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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "Logout successful" });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const [user] = await Users.getPublicProfile(req.user.id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateCurrentUser = async (req, res, next) => {
  try {
    const profileData = { ...req.body };
    if (profileData.birth_date) profileData.birth_date = profileData.birth_date.toISOString().slice(0, 10);
    const [user] = await Users.updateProfile(req.user.id, profileData);
    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
