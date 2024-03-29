require("dotenv").config();
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoutes from "./routes/userRoutes";
import RoleRoutes from "./routes/roleRoutes";
import FeatureRoutes from "./routes/featureRoutes";
import { insertInitialData } from "./utils/initialInsert";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.get("/api/initiatedata", async (req, res) => {
  await insertInitialData();
  return res.status(200).json({
    success: true,
    message: "Inserted successfully",
  });
});

app.use("/api/user", UserRoutes);
app.use("/api/role", RoleRoutes);
app.use("/api/feature", FeatureRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
