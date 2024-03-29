import { Request, Response } from "express";
import { Feature, Role, RoleFeature } from "../models";
import sequelize from "../db/config";

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

    for (const feature of features) {
      if (feature.access !== "write" && feature.access !== "read") {
        return res.status(400).json({
          success: false,
          message: "Invalid Access",
        });
      }

      const featureExist: any = await Feature.findOne({
        where: {
          id: feature.feature_id,
        },
      });

      if (!featureExist) {
        return res.status(404).json({
          success: false,
          message: "Feature not found",
        });
      }

      if (featureExist?.active !== true) {
        return res.status(400).json({
          success: false,
          message: "You've inclueded the feature which is currently not active",
        });
      }
    }

    const existingRole = await Role.findOne({
      where: {
        role_name: name,
      },
    });

    if (existingRole) {
      return res.status(200).json({
        success: false,
        message: "Role with the name already exists",
      });
    }

    const transactionResult = await sequelize.transaction(async (t) => {
      const role: any = await Role.create(
        { role_name: name },
        { transaction: t }
      );

      for (const feature of features) {
        await RoleFeature.create(
          {
            role_id: role.id,
            feature_id: feature.feature_id,
            enabled: feature.enabled,
            access: feature.access,
          },
          { transaction: t }
        );
      }

      return Role.findByPk(role.id, {
        include: [
          {
            model: Feature,
            attributes: ["id", "feature_name", "active"],
            through: {
              attributes: ["enabled", "access"],
            },
          },
        ],
        transaction: t,
      });
    });

    return res.status(200).json({
      success: true,
      message: "Role create successfully",
      role: transactionResult,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Try Again Later",
    });
  }
};
