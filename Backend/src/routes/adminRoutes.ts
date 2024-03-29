import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import { AllUsers, assignRole } from "../controllers/users";
import { allRoles, createRole } from "../controllers/roles";
import { allFeatures, createFeature } from "../controllers/features";

const router = express.Router();

//USERS

router.get(
  "/allUsers",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "read" }]),
  AllUsers
);

router.post(
  "/assignRole",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  assignRole
);

//ROLES

router.get(
  "/allRoles",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "read" }]),
  allRoles
);

router.post(
  "/createRole",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "read" }]),
  createRole
);

//FEATURES

router.get(
  "/allFeatures",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  allFeatures
);

router.post(
  "/createFeature",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  createFeature
);

export default router;
