import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import { Login, Signup } from "../controllers/auth";
import { AllUsers, assignRole } from "../controllers/users";

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

export default router;
