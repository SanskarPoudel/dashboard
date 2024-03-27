require("dotenv").config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
