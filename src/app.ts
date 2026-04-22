import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import apiRoutes from "./routes";
import { sendHealth } from "./utils/api-response";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev"),
);

app.get("/health", (_req, res) => {
  sendHealth(res);
});

app.use("/api", apiRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
