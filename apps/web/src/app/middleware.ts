import { validateRequest } from '@/lib/auth/validate-request'

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname
  if (url.startsWith('/log-in') || url.startsWith('/sign-up')) {
    const { user } = await validateRequest()
    if (user) {
      return NextResponse.rewrite(new URL('/', request.url))
    }
  }

  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.rewrite(new URL('/log-in', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
