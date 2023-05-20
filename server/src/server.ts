import 'dotenv/config'

import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastify from 'fastify'
import { authRoutes } from './routes/auth'
import { memoriesRoutes } from './routes/memories'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'node:path'

const app = fastify()

// https://github.com/fastify/fastify-cors
app.register(cors, {
  origin: true,
})

// https://github.com/fastify/fastify-jwt
app.register(jwt, {
  // secret is kind of token signature of this
  // application to differentiate it from others
  secret: 'spacetime',
})

// https://github.com/fastify/fastify-multipart
app.register(multipart)

// https://github.com/fastify/fastify-static
// turns the folder '/upload' public and a route that can be accessed by the browser
app.register(fastifyStatic, {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(authRoutes)
app.register(memoriesRoutes)
app.register(uploadRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server is running')
  })
