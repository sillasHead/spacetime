'use client'

import { Memory } from '@/app/model/Memory'
import { isImg } from '@/app/utils/file'
import { ChangeEvent, useEffect, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'

interface Props {
  setValue: UseFormSetValue<Memory>
  path?: string
}

export function MediaPicker({ setValue, path }: Props) {
  const [preview, setPreview] = useState<{
    src: string
    isImg: boolean
  } | null>(null)

  useEffect(() => {
    if (path) {
      setPreview({ src: path, isImg: isImg(path) })
    }
  }, [path])

  const notify = () =>
    toast.info('Choose a file smaller than 5MB', {
      theme: 'colored',
      hideProgressBar: true,
    })

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files?.length) return

    const selectedFile = files[0]

    if (selectedFile.size > 5_242_880) {
      notify()
      return
    }

    const previewUrl = URL.createObjectURL(selectedFile)
    setPreview({ src: previewUrl, isImg: isImg(selectedFile.name) })
    setValue('file', selectedFile)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        id="file"
        name="file"
        type="file"
        accept="image/*,video/*"
        className="invisible h-0 w-0"
      />

      {preview &&
        (preview.isImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.src}
            alt=""
            // TODO: improve image view
            className="aspect-video w-full rounded-lg object-contain"
          />
        ) : (
          <video
            src={preview.src}
            controls
            className="aspect-video w-full rounded-lg object-contain"
          />
        ))}
      <ToastContainer />
    </>
  )
}
