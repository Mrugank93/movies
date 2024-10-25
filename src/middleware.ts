import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();
  const protectedPaths = new Set(['/', '/add', '/edit/*']);
  if (!authToken) {
    if (protectedPaths.has(url.pathname)) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      url.pathname = "/movies";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
