import { NextRequest, NextResponse } from 'next/server'

const signInUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(signInUrl, {
      // HttpOnly prevents user from accessing cookie from JS
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; max-age=20; HttpOnly;`,
      },
    })
  }

  // allows user to continue
  return NextResponse.next()
}

// runs when user tries to access any (:path*) path of memories via URL
export const config = {
  matcher: '/memories/:path*',
}
