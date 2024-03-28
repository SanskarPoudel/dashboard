import { Response } from "express";
import jwt from "jsonwebtoken";
export const generateToken = (payload: any, expiresIn: string) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn });
};

export const setSecureCookie = (
  res: Response,
  name: string,
  token: string,
  expiresInHours: number
) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(name, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    expires: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
  });
};
