import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'your-very-strong-secret-key';

// Helper to extract token from authorization header or cookies
function extractToken(request: any, isBackendRoute: any) {
  if (isBackendRoute) {
    const authorization =
      request.headers.get('authorization') ||
      request.headers.get('Authorization');
    return authorization ? authorization.split(' ')[1] : null;
  } else {
    const localToken = request.cookies.get('auditToken')?.value || '';
    return localToken ? localToken : null;
  }
}

// Function to decode the JWT token
async function verifyToken(token: any) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    return { payload, error: null };
  } catch (error: any) {
    return {
      payload: null,
      error: error.message || 'Invalid or Expired token',
    };
  }
}

// Helper to handle frontend redirection for unauthorized users
function handleFrontendRedirection(pathname: any, request: any) {
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

// Middleware function
export async function middleware(request: any) {
  const { pathname } = request.nextUrl;
  const isBackendRoute = pathname.startsWith('/api');
  const isFrontendRoute = pathname.startsWith('/');

  // Extract token from request
  const token = extractToken(request, isBackendRoute);

  // Handle missing token
  if (!token) {
    if (isBackendRoute) {
      return NextResponse.json(
        { error: true, message: 'Authorization header or token missing!' },
        { status: 401 }
      );
    } else if (isFrontendRoute) {
      return handleFrontendRedirection(pathname, request);
    }
  }

  // Verify the JWT token
  const { payload, error } = await verifyToken(token);
  console.info('Payload:', payload);

  if (error) {
    if (isFrontendRoute) {
      return handleFrontendRedirection(pathname, request);
    } else {
      return NextResponse.json(
        { error: true, message: error },
        { status: 401 }
      );
    }
  }

  // Continue with the request if authenticated
  return NextResponse.next();
}

// Configure the middleware to run on specific routes
export const config = {
  matcher: [
    '/api/admin/:path*',
    '/dashboard',
    '/dashboard/chapters',
    '/dashboard/users',
    '/dashboard/auditing',
    '/dashboard/discussions',
    '/dashboard/profile',
  ],
};
