import { loadEnvConfig } from "./config/loadEnv.js";

import express from "express";
import cors from "cors";

import initDB from "./config/initDB.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import coinRoutes from "./routes/coinRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import cookieParser from "cookie-parser";

loadEnvConfig();

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://numismatic.vercel.app",
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "numismatic-api",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/coins", coinRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);

initDB().then(() => {
  const PORT = process.env.PORT || process.env.DEV_PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

app.use(errorHandler);
