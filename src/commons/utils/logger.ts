import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  // Add other Pino options as needed (e.g., transports for custom output)
});
