import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import { Login, Signup } from "../controllers/auth";
import { AllUsers, assignRole, removeRole } from "../controllers/users";

const router = express.Router();

router.post("/signup", Signup);

router.post("/login", Login);

router.get(
  "/all",
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

router.post(
  "/removeRole",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  removeRole
);

export default router;
