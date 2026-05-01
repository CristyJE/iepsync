import "dotenv/config";
import express from "express";
import cors from "cors";

import goalsRouter from "./routes/goals.js";
import sessionsRouter from "./routes/sessions.js";
import iepRouter from "./routes/iep.js";
import agentRouter from "./routes/agent.js";
import usersRouter from "./routes/users.js";
import { authMiddleware } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", app: "IEPSync API" }));

// Routes
app.use("/api/users", usersRouter);
app.use("/api/goals", authMiddleware, goalsRouter);
app.use("/api/sessions", authMiddleware, sessionsRouter);
app.use("/api/iep", authMiddleware, iepRouter);
app.use("/api/agent", authMiddleware, agentRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌉 IEPSync API running on port ${PORT}`);
});
