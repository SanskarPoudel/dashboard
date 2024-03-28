import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import { AllUsers } from "../controllers/users";

const router = express.Router();

router.get(
  "/allUsers",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  AllUsers
);

export default router;
