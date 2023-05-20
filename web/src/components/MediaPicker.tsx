'use client'

import { ChangeEvent, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)
  const [isImg, setIsImg] = useState<boolean>(true)
  const notify = () =>
    toast.info('Choose a file smaller than 5MB', {
      theme: 'colored',
      hideProgressBar: true,
    })

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    const imageTypes = ['image/png', 'image/jpeg', 'image/gif']
    const videoTypes = ['video/mp4']

    if (!files?.length) return

    if (files[0].size > 5_242_880) {
      notify()
      return
    }

    if (imageTypes.includes(files[0].type)) {
      setIsImg(true)
    } else if (videoTypes.includes(files[0].type)) {
      setIsImg(false)
    }

    const previewUrl = URL.createObjectURL(files[0])
    setPreview(previewUrl)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        name="coverUrl"
        type="file"
        id="media"
        accept="image/*,video/*"
        className="invisible h-0 w-0"
      />

      {preview &&
        (isImg ? (
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
