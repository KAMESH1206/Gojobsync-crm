import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Force overwrite in dev to pick up schema changes
globalThis.prisma = new PrismaClient();
export const prisma = globalThis.prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
