import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import initDB from "./config/initDB.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);

initDB().then(() => {
  const PORT = process.env.DEV_PORT;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

app.use(errorHandler);
