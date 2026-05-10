import { NextResponse } from 'next/server'
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth/session'

export function middleware(request) {
  const path = request.nextUrl.pathname

  // Only protect /admin/* (excluding /admin/login)
  if (!path.startsWith('/admin') || path.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  const session = verifySessionToken(token)
  if (!session) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', path)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
