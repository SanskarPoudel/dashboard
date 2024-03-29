import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import {
  addFeature,
  allRoles,
  createRole,
  deleteRole,
  removeRoleFeature,
  updateRoleFeature,
} from "../controllers/roles";

const router = express.Router();

router.get(
  "/all",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "read" }]),
  allRoles
);

router.post(
  "/create",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  createRole
);

router.post(
  "/addFeature",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  addFeature
);

router.post(
  "/updateFeature",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  updateRoleFeature
);

router.post(
  "/removeFeature",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  removeRoleFeature
);

router.delete(
  "/delete",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  deleteRole
);

export default router;
