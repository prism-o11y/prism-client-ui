// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const jwtCookie = request.cookies.get('jwt')


  // If there's a JWT cookie, redirect to the home page
  if (jwtCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If there's no JWT cookie, redirect to the login page
  return NextResponse.redirect('http://localhost:81/api/user-service/auth/login')
}

// Update the matcher to include all routes except API routes and static assets
export const config = {
  matcher: ['/'],
}