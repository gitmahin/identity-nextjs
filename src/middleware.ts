import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/sign-up" || path.startsWith("/verify-email")
  const token = request.cookies.get("token")?.value || ""

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/myinfo', request.url))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

}

export const config = {
  matcher: [
    '/login',
    '/sign-up',
    '/myinfo',
    '/verify-email/:path*',
  ]
}