import { Response, NextFunction } from "express";
import { CustomRequest } from "./auth";
import db from "../db/config";
import { RowDataPacket, FieldPacket } from "mysql2";

interface UserPermission extends RowDataPacket {
  feature_name: string;
  access: string;
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
        SELECT f.feature_name, rf.access
        FROM role_features rf
        JOIN features f ON rf.feature_id = f.id
        WHERE rf.role_id = ? AND f.active = true
      `;

      const [results, fields]: [
        RowDataPacket[] | RowDataPacket[][],
        FieldPacket[]
      ] = await db.query(query, [role_id]);

      const userPermissions: UserPermission[] = results as UserPermission[];

      const permissionMap = new Map(
        userPermissions.map((p) => [p.feature_name, p.access])
      );

      const hasPermission = requiredPermissions.every((rp) => {
        const access = permissionMap.get(rp.feature);
        return access && (access === rp.access || access === "write");
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
