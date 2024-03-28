import { Request, Response } from "express";
import { Feature } from "../models";

export const allFeatures = async (req: Request, res: Response) => {
  try {
    const features = await Feature.findAll({});

    return res.status(200).json({
      success: true,
      features: features,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try Again Later.",
    });
  }
};
