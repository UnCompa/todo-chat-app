import { PrismaClient } from 'src/generated/prisma/index.js';

declare global {
  // Evitamos que Prisma cree múltiples instancias en dev (hot reload)
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [], // opcional para debug
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
