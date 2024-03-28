import { Request, Response } from "express";
import { Feature, Role, RoleFeature } from "../models";

export const allRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Feature,
          attributes: ["id", "feature_name", "active"],
          through: {
            attributes: ["enabled", "access"],
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      roles: roles,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try Again Later.",
    });
  }
};

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, features } = req.body as {
      name: string;
      features: { access: string; feature_id: number; enabled: boolean }[];
    };

    if (!name || !features || features.length === 0) {
      return res.status(400).json({
        succes: false,
        message: "Please enter all required fields",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try Again Later",
    });
  }
};
