import fp from 'fastify-plugin'
import { PrismaClient } from '../generated/prisma/client.js'
// add this import:
import { PrismaPg } from '@prisma/adapter-pg'

// Fastify augmentation omitted for brevity (keep your existing declare module ...)

export default fp(async (app) => {
  // create a Postgres adapter instance that uses the DATABASE_URL from env
  const adapter = new PrismaPg({
    // connectionString accepts the same DATABASE_URL you already use
    connectionString: process.env.DATABASE_URL
  })

  // pass the adapter to PrismaClient
  const prisma = new PrismaClient({ adapter })

  app.decorate('prisma', prisma)

  app.addHook('onClose', async (inst) => {
    await inst.prisma.$disconnect()
  })
})
