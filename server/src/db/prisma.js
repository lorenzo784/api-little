import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger.js';

export const prisma = new PrismaClient();

process.on('beforeExit', async () => {
  logger.info('Prisma: beforeExit');
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  logger.info('Prisma: SIGINT received, disconnecting...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Prisma: SIGTERM received, disconnecting...');
  await prisma.$disconnect();
  process.exit(0);
});
