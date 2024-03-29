import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import { allRoles, createRole } from "../controllers/roles";

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
  permissionCheck([{ feature: "admin", access: "read" }]),
  createRole
);

export default router;
