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
