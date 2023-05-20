import { FastifyInstance } from 'fastify'
import { extname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

// pipeline  -> helps to know if the file has already been uploaded
// promisify -> 'turns' some functions into promises
const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/upload', async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5MB
      },
    })

    if (!upload) {
      return reply.status(400).send('No file uploaded')
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send('Invalid file format')
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)

    // generate a random file name to ensure that the file will be
    // unique in case uploading the same file twice or more
    const fileName = fileId.concat(extension)

    // __dirname is the directory where the current file is located
    // resolve is used to standardize the path according to the OS
    const writeStream = createWriteStream(
      resolve(__dirname, '../../uploads/', fileName),
    )

    await pump(upload.file, writeStream)

    // request.protocol -> http or https
    // request.hostname -> app domain - localhost:3000
    const fullUrl = request.protocol.concat('://').concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return { fileUrl }
  })
}
