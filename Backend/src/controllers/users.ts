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

export const userDetails = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UnAuthorized",
      });
    }

    const userDetails = await User.findOne({
      where: { id: userId },
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
      details: userDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "UnAuthorized",
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

export const removeRole = async (req: CustomRequest, res: Response) => {
  try {
    const { user_id } = req.body as {
      user_id: number;
    };

    if (req.user?.id === user_id) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove your own role",
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

    await User.update(
      { role_id: null },
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
      message: "Role removed Successfully",
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
