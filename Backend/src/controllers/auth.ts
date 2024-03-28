import { Request, Response } from "express";
import db from "../db/config";
import bcrypt from "bcrypt";
import { FieldPacket } from "mysql2";
import { generateToken, setSecureCookie } from "../utils/auth";
import { User } from "../models";

const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || "1d";

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required credentials",
      });
    }

    const user: any = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateToken(
      {
        id: user.id,
        role_id: user.role_id,
      },
      ACCESS_TOKEN_LIFE
    );

    setSecureCookie(res, "token", accessToken, 24);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try again later.",
    });
  }
};

export const Signup = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    const existingUser = await User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: any = await User.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      first_name,
      last_name,
    });

    const accessToken = generateToken(
      {
        id: newUser.id,
        role_id: newUser.role_id || null,
      },
      ACCESS_TOKEN_LIFE
    );

    setSecureCookie(res, "token", accessToken, 24);

    return res.status(201).json({
      success: true,
      message: "Signed Up Successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try again later.",
    });
  }
};
