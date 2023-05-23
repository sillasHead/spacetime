'use client'

import { Memory } from '@/app/model/Memory'
import { isImg } from '@/app/utils/file'
import { ChangeEvent, useState } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'

export function MediaPicker({
  setValue,
}: {
  setValue: UseFormSetValue<Memory>
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [filePath, setFilePaht] = useState<string | null>(null)

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

    setFilePaht(selectedFile.name)

    const previewUrl = URL.createObjectURL(selectedFile)
    setPreview(previewUrl)
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
        filePath &&
        (isImg(filePath) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt=""
            // TODO: improve image view
            className="aspect-video w-full rounded-lg object-contain"
          />
        ) : (
          <video
            src={preview}
            controls
            className="aspect-video w-full rounded-lg object-contain"
          />
        ))}
      <ToastContainer />
    </>
  )
}
