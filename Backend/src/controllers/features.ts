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

export const createFeature = async (req: Request, res: Response) => {
  try {
    const { name, active } = req.body as { name: string; active: boolean };

    if (!name || !active) {
      return res.status(404).json({
        success: false,
        message: "Please enter required fields",
      });
    }

    const featureExists = await Feature.findOne({
      where: {
        feature_name: name,
      },
    });

    if (featureExists) {
      return res.status(200).json({
        success: false,
        message: "Feature with this name already exists",
      });
    }

    const feature = await Feature.create({
      feature_name: name,
      active: active,
    });

    return res.status(200).json({
      success: true,
      message: "Feature Created Successfully",
      feature: feature,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try Again Later.",
    });
  }
};
