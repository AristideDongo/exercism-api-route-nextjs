import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

prisma.$connect()
  .then(() => console.log("Prisma connected successfully"))
  .catch(e => console.error("Prisma connection error:", e));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma