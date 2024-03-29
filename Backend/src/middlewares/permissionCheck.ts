import { Response, NextFunction } from "express";
import { CustomRequest } from "./auth";
import { Role, Feature, User } from "../models";

export function permissionCheck(
  requiredPermissions: { feature: string; access: string }[]
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const user_id = req.user?.id;
      if (!user_id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const userInfo: any = await User.findOne({
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

      if (!userInfo.Role) {
        return res.status(404).json({ message: "Role not found" });
      }

      const permissionMap = new Map(
        userInfo.Role.Features.map((f: any) => [
          f.feature_name,
          { access: f.RoleFeature.access, enabled: f.RoleFeature.enabled },
        ])
      );

      const hasPermission = requiredPermissions.every((rp) => {
        const permission: any = permissionMap.get(rp.feature);
        return (
          permission &&
          permission.enabled &&
          (permission.access === rp.access || permission.access === "write")
        );
      });

      if (!hasPermission) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
