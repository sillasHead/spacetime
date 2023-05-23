import { api } from '@/lib/api'
import { cookies } from 'next/headers'

interface Params {
  params: { id: string }
}

export default async function generateStaticParams({ params }: Params) {
  const token = cookies().get('token')?.value
  const response = await api.get(`/memories/${params.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memory = response.data
  console.log({ memory })
}
