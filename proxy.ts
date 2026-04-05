import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const dashboardPaths = [
      '/dashboard', '/vault', '/analytics', '/resources',
      '/badges', '/network', '/marketplace', '/opportunities'
    ];
    const isOnDashboard = dashboardPaths.some(p => req.nextUrl.pathname.startsWith(p));

    if (isOnDashboard && !token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  { 
    callbacks: { authorized: () => true },
    secret: process.env.NEXTAUTH_SECRET || 'extraordinary-fallback-secret-for-demo',
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
