import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'

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

app.register(authRoutes)
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Server is running')
  })
