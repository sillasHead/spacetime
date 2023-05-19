import { PrismaClient } from '@prisma/client'

// shows db queries in terminal
export const prisma = new PrismaClient({
  log: ['query'],
})
