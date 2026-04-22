export const logger = {
  info: (message: string, ...meta: unknown[]): void => {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`, ...meta);
  },
  error: (message: string, ...meta: unknown[]): void => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`, ...meta);
  },
};
