'use client'

import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { MediaPicker } from './MediaPicker'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Memory } from '@/app/model/Memory'

interface Props {
  memory?: Memory
}

export function MemoryForm({ memory }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Memory>()
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (memory) {
      setValue('content', memory.content)
      setValue('isPublic', memory.isPublic)
    }
  }, [setValue, memory])

  const onSubmit: SubmitHandler<Memory> = async (data) => {
    let coverUrl = ''

    if (data.file) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', data.file)

      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    }
    const token = Cookie.get('token')

    if (memory) {
      await api.put(
        `/memories/${memory.id}`,
        {
          coverUrl: coverUrl || memory.coverUrl,
          content: data.content,
          isPublic: data.isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } else {
      await api.post(
        '/memories',
        {
          coverUrl,
          content: data.content,
          isPublic: data.isPublic,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    }

    router.push('/')
  }

  const deleteMemory = async () => {
    const token = Cookie.get('token')
    await api.delete(`/memories/${memory?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    router.push('/')
  }

  function handleTextareaBlur() {
    if (contentRef.current) {
      const trimmedValue = contentRef.current.value.trim()
      contentRef.current.value = trimmedValue
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-2"
    >
      <div className="flex items-center gap-4">
        <label
          htmlFor="file"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Attach media
        </label>

        <label
          htmlFor="isPublic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            {...register('isPublic')}
            id="isPublic"
            type="checkbox"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          make memory public
        </label>
      </div>
      <MediaPicker setValue={setValue} path={memory?.coverUrl} />

      <textarea
        {...register('content')}
        onBlur={handleTextareaBlur}
        spellCheck="false"
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Feel free to add photos, videos and stories about the experiences you want to remember forever!"
      />
      {errors.content && <span>This field is required</span>}

      {memory ? (
        <div className="flex justify-between">
          <button
            type="button"
            onClick={deleteMemory}
            className="rounded-full bg-red-400 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-red-500"
          >
            Delete
          </button>
          <button
            type="submit"
            className="rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
          >
            Update
          </button>
        </div>
      ) : (
        <button
          type="submit"
          className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
        >
          Save
        </button>
      )}
    </form>
  )
}
