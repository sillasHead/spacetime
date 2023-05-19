import { getUser } from '@/lib/auth'
import Image from 'next/image'

export function Profile() {
  const { name, avatarUrl } = getUser()

  return (
    <div className="flex items-center gap-3 text-left">
      {/* for external images put the domains in next.config.js */}
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt=""
        className="rounded-full"
      />

      <p className="max-w-[180px] text-sm leading-snug">
        {name}
        <a
          href="/api/auth/sign-out"
          className="block text-red-400 hover:text-red-300"
        >
          Sign out
        </a>
      </p>
    </div>
  )
}
