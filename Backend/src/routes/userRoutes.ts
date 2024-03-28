import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { permissionCheck } from "../middlewares/permissionCheck";
import { Login, Signup } from "../controllers/auth";

const router = express.Router();

router.post("/signup", Signup);

router.post("/login", Login);

export default router;
