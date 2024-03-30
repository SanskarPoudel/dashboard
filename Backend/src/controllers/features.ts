import { Request, Response } from "express";
import { Feature, RoleFeature } from "../models";

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

export const updateFeature = async (req: Request, res: Response) => {
  try {
    const { id, active } = req.body as { id: number; active: boolean };

    await Feature.update(
      { active: active },
      {
        where: {
          id: id,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Feature Updated Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try Again Later",
    });
  }
};

export const deleteFeature = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }

    await Feature.destroy({
      where: {
        id: id,
      },
    });

    const roleFeaturesExists = await RoleFeature.findAll({
      where: {
        feature_id: id,
      },
    });

    if (roleFeaturesExists.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "This feature is assigned to a role . Please remove it to continue",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Feature deleted successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
