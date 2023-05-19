import Image from 'next/image'
import nlwLogo from '../assets/nlw-spacetime-logo.svg'

export function Hero() {
  return (
    <div className="space-y-5">
      {/* space-y: is similar to gap in flexbox */}
      <Image src={nlwLogo} alt="NLW Spacetime" />

      <div className="max-w-sm space-y-1">
        <h1 className="text-5xl font-bold leading-tight text-gray-50">
          Your time capsule
        </h1>
        <p className="text-lg leading-relaxed">
          Collect memorable moments of your jorney and share them with the world
        </p>
      </div>

      <a
        href=""
        className="inline-block rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        CREATE MEMORY
      </a>
    </div>
  )
}
