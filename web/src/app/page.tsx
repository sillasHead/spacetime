import { EmptyMemories } from '@/components/EmptyMemories'
import { api } from '@/lib/api'
import { ArrowRight } from 'lucide-react'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { isImg } from './utils/file'

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get('token')?.value
  const response = await api.get('/memories', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories: Memory[] = response.data

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        const date = new Date(memory.createdAt)
        return (
          <div key={memory.id} className="space-y-4">
            <time className="-ml-8 flex items-center gap-2 text-sm text-gray-100 before:h-px before:w-5 before:bg-gray-50">
              {new Intl.DateTimeFormat('en-US', options).format(date)}
            </time>
            {isImg(memory.coverUrl) ? (
              <Image
                src={memory.coverUrl}
                alt=""
                width={592}
                height={280}
                className="aspect-video w-full rounded-lg object-contain"
              />
            ) : (
              <video
                src={memory.coverUrl}
                width={592}
                height={280}
                controls
                className="aspect-video w-full rounded-lg object-contain"
              />
            )}

            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>

            <Link
              href={`/memories/${memory.id}`}
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
            >
              Read more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
