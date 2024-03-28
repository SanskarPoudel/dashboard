import { Response, NextFunction } from "express";
import { CustomRequest } from "./auth";
import { Role, Feature } from "../models";

export function permissionCheck(
  requiredPermissions: { feature: string; access: string }[]
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const role_id = req.user?.role_id;
      if (!role_id) {
        return res.status(403).json({ message: "Insufficient Permissions" });
      }

      const roleWithFeatures: any = await Role.findByPk(role_id, {
        include: [
          {
            model: Feature,
            through: {
              attributes: ["enabled", "access"],
            },
            where: { active: true },
            required: true,
          },
        ],
      });

      if (!roleWithFeatures) {
        return res.status(404).json({ message: "Role not found" });
      }

      const permissionMap = new Map(
        roleWithFeatures.Features.map((f: any) => [
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
