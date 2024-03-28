import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import { AllUsers } from "../controllers/users";
import { allRoles } from "../controllers/roles";
import { allFeatures } from "../controllers/features";

const router = express.Router();

router.get(
  "/allUsers",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "read" }]),
  AllUsers
);

router.get(
  "/allRoles",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "read" }]),
  allRoles
);

router.get(
  "/allFeatures",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "read" }]),
  allFeatures
);

export default router;
