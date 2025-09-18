import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'warn', emit: 'stdout' },
      { level: 'error', emit: 'stdout' },
      { level: 'query', emit: 'event' },
    ],
    datasources: {
      db: {
        url:
          process.env.NODE_ENV === 'production'
            ? process.env.DATABASE_URL  
            : process.env.DIRECT_URL,    
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

