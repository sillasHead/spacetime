import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { resolve } from 'node:path'
const fs = require('fs')

export async function memoriesRoutes(app: FastifyInstance) {
  // checking if user is authenticated before running any route
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return memories.map((memory) => {
      const excerpt =
        memory.content.length > 115
          ? memory.content.substring(0, 115).concat('...')
          : memory.content

      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        createdAt: memory.createdAt,
        excerpt,
      }
    })
  })

  app.get('/memories/:id', async (request, reply) => {
    // validation -> https://github.com/colinhacks/zod
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (!memory.isPublic && memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    return memory
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    // coerce -> converts the value to boolean, similar to Boolean(value)

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub,
      },
    })

    return memory
  })

  app.put('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    // coerce -> converts the value to boolean, similar to Boolean(value)

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    let memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    memory = await prisma.memory.update({
      where: { id },
      data: { content, coverUrl, isPublic },
    })

    return memory
  })

  app.delete('/memories/:id', async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    })

    fs.unlink(
      resolve(`./uploads/${memory.coverUrl.split('uploads/')[1]}`),
      (error: any) => {
        if (error) {
          console.error('Error deleting file:', error)
        } else {
          console.log('File deleted successfully.')
        }
      },
    )

    if (memory.userId !== request.user.sub) {
      return reply.status(401).send()
    }

    await prisma.memory.delete({
      where: { id },
    })
  })
}
