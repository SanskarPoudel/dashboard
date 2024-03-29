import { Request, Response } from "express";
import { Feature, Role, RoleFeature, User } from "../models";
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

export const addFeature = async (req: Request, res: Response) => {
  try {
    const { id, feature } = req.body as {
      id: number;
      feature: { access: string; feature_id: number; enabled: boolean };
    };

    if (!id || !feature || !feature.access) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    if (feature.access !== "read" && feature.access !== "write") {
      return res.status(400).json({
        success: false,
        message: "Invalid access",
      });
    }

    const role = await Role.findOne({
      where: {
        id: id,
      },
    });

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role not found",
      });
    }

    const featureExists = await Feature.findOne({
      where: {
        id: feature.feature_id,
      },
    });

    if (!featureExists) {
      return res.status(400).json({
        success: false,
        message: "Feature not found",
      });
    }

    const roleFeature = await RoleFeature.findOne({
      where: {
        role_id: id,
        feature_id: feature.feature_id,
      },
    });

    if (roleFeature) {
      return res.status(200).json({
        success: false,
        message: "Feature already exists in the role",
      });
    }

    await RoleFeature.create({
      role_id: id,
      feature_id: feature.feature_id,
      enabled: feature.enabled,
      access: feature.access,
    });

    const finalRole = await Role.findByPk(id, {
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
      message: "Feature added Successfully",
      role: finalRole,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: "Something went wrong. Try Again",
    });
  }
};

export const updateRoleFeature = async (req: Request, res: Response) => {
  try {
    const { id, feature } = req.body as {
      id: number;
      feature: { access: string; feature_id: number; enabled: boolean };
    };

    if (!id || !feature || !feature.access) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    if (feature.access !== "read" && feature.access !== "write") {
      return res.status(400).json({
        success: false,
        message: "Invalid access",
      });
    }

    const role = await Role.findOne({
      where: {
        id: id,
      },
    });

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role not found",
      });
    }

    const featureExists = await Feature.findOne({
      where: {
        id: feature.feature_id,
      },
    });

    if (!featureExists) {
      return res.status(400).json({
        success: false,
        message: "Role Feature not found",
      });
    }

    const roleFeature = await RoleFeature.findOne({
      where: {
        role_id: id,
        feature_id: feature.feature_id,
      },
    });

    if (!roleFeature) {
      return res.status(200).json({
        success: false,
        message: "Role feature not found",
      });
    }

    await RoleFeature.update(
      {
        enabled: feature.enabled,
        access: feature.access,
      },
      {
        where: {
          role_id: id,
          feature_id: feature.feature_id,
        },
      }
    );

    const finalRole = await Role.findByPk(id, {
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
      message: "Role Feature updated Successfully",
      role: finalRole,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: "Something went wrong. Try Again",
    });
  }
};

export const removeRoleFeature = async (req: Request, res: Response) => {
  try {
    const { id, feature } = req.body;

    if (!id || !feature) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    const role = await Role.findOne({
      where: {
        id: id,
      },
    });

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role not found",
      });
    }

    const featureExists = await Feature.findOne({
      where: {
        id: feature,
      },
    });

    if (!featureExists) {
      return res.status(400).json({
        success: false,
        message: "Role Feature not found",
      });
    }

    const roleFeatures = await RoleFeature.findAll({
      where: {
        role_id: id,
      },
    });

    if (roleFeatures.length <= 1) {
      return res.status(200).json({
        success: false,
        message: "One feature is mandatory in a role",
      });
    }

    const thisRoleFeature = roleFeatures.filter((rf: any) => {
      return rf.feature_id === feature;
    });

    if (!thisRoleFeature) {
      return res.status(404).json({
        success: false,
        message: "Feature association not found with role",
      });
    }

    await RoleFeature.destroy({
      where: {
        role_id: id,
        feature_id: feature,
      },
    });

    const finalRole = await Role.findByPk(id, {
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
      message: "Feature removed successfuly",
      role: finalRole,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({
      success: false,
      message: "Something went wrong. Try Again",
    });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is Required",
      });
    }

    const role = await Role.findOne({
      where: {
        id: id,
      },
    });

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role not found",
      });
    }

    const usersWithRole = await User.findAll({
      where: {
        role_id: id,
      },
    });

    if (usersWithRole.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Role is assigned to some users. Cannot delete it.",
      });
    }

    await Role.destroy({
      where: {
        id: id,
      },
    });

    await RoleFeature.destroy({
      where: {
        role_id: id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Role deleted Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
