import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export interface CustomRequest extends Request {
  user?: {
    id: number;
    role_id: number;
  };
}

export const isAuthenticated = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const jwtSecret = process.env.JWT_SECRET as string;

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = verify(token, jwtSecret);
    req.user = decoded as CustomRequest["user"];
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
