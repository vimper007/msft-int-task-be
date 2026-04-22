import app from "./app";
import { env } from "./config/env";
import { prisma } from "./prisma/client";
import { logger } from "./utils/logger";

let server: ReturnType<typeof app.listen> | undefined;

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();

    server = app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000).unref();

    return;
  }

  await prisma.$disconnect();
  process.exit(0);
}

void startServer();

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
