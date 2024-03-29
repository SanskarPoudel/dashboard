import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  allFeatures,
  createFeature,
  deleteFeature,
  updateFeature,
} from "../controllers/features";
import { permissionCheck } from "../middlewares/permissionCheck";

const router = express.Router();

router.get(
  "/all",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  allFeatures
);

router.post(
  "/create",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  createFeature
);

router.post(
  "/update",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  updateFeature
);

router.delete(
  "/delete",
  isAuthenticated,
  permissionCheck([{ feature: "admin", access: "write" }]),
  deleteFeature
);

export default router;
