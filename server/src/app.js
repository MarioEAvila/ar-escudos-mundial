import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import sportsRoutes from "./routes/sportsRoutes.js";
import worldCupRoutes from "./routes/worldCupRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandlers.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", feedRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/worldcup", worldCupRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/sports", sportsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
