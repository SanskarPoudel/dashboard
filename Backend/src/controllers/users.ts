import { Request, Response } from "express";
import { Feature, Role, RoleFeature, User } from "../models";
import { CustomRequest } from "../middlewares/auth";

export const AllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] }, // Exclude the password attribute
      include: [
        {
          model: Role,
          attributes: ["id", "role_name"],
          include: [
            {
              model: Feature,
              attributes: ["id", "feature_name", "active"],
              through: {
                attributes: ["enabled", "access"], // Correctly include attributes from the join table here
              },
            },
          ],
        },
      ],
    });

    return res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching users",
    });
  }
};

export const assignRole = async (req: CustomRequest, res: Response) => {
  try {
    const { role_id, user_id } = req.body as {
      role_id: number;
      user_id: number;
    };

    if (req.user?.id === user_id) {
      return res.status(200).json({
        success: false,
        message: "You cannot update your own role",
      });
    }

    const userExists = await User.findOne({
      where: {
        id: user_id,
      },
    });

    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const roleExists = await Role.findOne({
      where: {
        id: role_id,
      },
    });

    if (!roleExists) {
      return res.status(400).json({
        success: false,
        message: "Role not found",
      });
    }

    await User.update(
      { role_id },
      {
        where: {
          id: user_id,
        },
      }
    );

    const updatedUser = await User.findOne({
      where: { id: user_id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Role,
          attributes: ["id", "role_name"],
          include: [
            {
              model: Feature,
              attributes: ["id", "feature_name", "active"],
              through: {
                attributes: ["enabled", "access"],
              },
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Role Updated Successfully",
      updatedUser: updatedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again",
    });
  }
};

async function insertInitialData() {
  try {
    const feature: any = await Feature.create({
      feature_name: "admin",
      active: true,
    });

    const role: any = await Role.create({
      role_name: "Administrator",
    });

    await RoleFeature.create({
      role_id: role.id,
      feature_id: feature.id,
      enabled: true,
      access: "write",
    });

    await User.create({
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      password: "$2b$10$Qt7t0VZC74FCWi0..sAMVO5DUAXNpzSD2bpWY8HsM1tXprqTde.sW", // "admin_password"
      role_id: role.id,
    });

    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}
