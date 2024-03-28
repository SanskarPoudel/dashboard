require("dotenv").config();
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import UserRoutes from "./routes/userRoutes";
import AdminRoutes from "./routes/adminRoutes";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/api/user", UserRoutes);
app.use("/api/admin", AdminRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
