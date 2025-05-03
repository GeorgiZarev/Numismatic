import { loadEnvConfig } from "./config/loadEnv.js";

import express from "express";
import cors from "cors";

import initDB from "./config/initDB.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import coinRoutes from "./routes/coinRoutes.js";
import cookieParser from "cookie-parser";

loadEnvConfig();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/coins", coinRoutes);

initDB().then(() => {
  const PORT = process.env.DEV_PORT;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

app.use(errorHandler);
