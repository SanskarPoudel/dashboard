import { Response, NextFunction } from "express";
import { CustomRequest } from "./auth";
import db from "../db/config";
import { RowDataPacket, FieldPacket } from "mysql2";

interface UserPermission extends RowDataPacket {
  feature_name: string;
  access: string;
  enabled: boolean;
}

export function permissionCheck(
  requiredPermissions: { feature: string; access: string }[]
) {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const role_id = req.user?.role_id;
      if (!role_id) {
        return res.status(403).json({ message: "User role not found" });
      }

      const query = `
        SELECT f.feature_name, rf.access, rf.enabled
        FROM role_features rf
        JOIN features f ON rf.feature_id = f.id
        WHERE rf.role_id = ? AND f.active = true
      `;

      const [results]: [UserPermission[], FieldPacket[]] = await db.query(
        query,
        [role_id]
      );

      const permissionMap = new Map<
        string,
        { access: string; enabled: boolean }
      >(
        results.map((p) => [
          p.feature_name,
          { access: p.access, enabled: p.enabled },
        ])
      );

      const hasPermission = requiredPermissions.every((rp) => {
        const permission = permissionMap.get(rp.feature);
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
