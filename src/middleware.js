import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import prisma from '../config/prisma';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'your-very-strong-secret-key';

// Function to decode the JWT token
async function verifyToken(token) {
    try {
        const secret = new TextEncoder().encode(JWT_SECRET_KEY);
        const { payload } = await jwtVerify(token, secret);
        return { payload, error: null };
    } catch (error) {
        return { payload: null, error: 'Invalid or Expired token' };
    }
}

// Admin Authentication Middleware
export async function middleware(request) {
    const authorization = request.headers.get('authorization') || request.headers.get('Authorization');

    if (!authorization) {
        return NextResponse.json({ error: true, message: 'Authorization header missing!' }, { status: 401 });
    }

    const token = authorization.split(' ')[1];

    // Verify the JWT
    const { payload, error } = await verifyToken(token);
    if (error) {
        return NextResponse.json({ error: true, message: error }, { status: 401 });
    }

    try {
        // Find the admin user based on decoded payload
        // const admin = await prisma.user.findUnique({ where: { id: payload.id } });
        // if (!admin) {
        //     return NextResponse.json({ error: true, message: 'User does not exist.' }, { status: 401 });
        // }
        // if (admin.role !== 'admin') {
        //     return NextResponse.json({ error: true, message: 'Incorrect user role.' }, { status: 401 });
        // }
        // if (!admin.isActive) {
        //     return NextResponse.json({ error: true, message: 'Account is inactive.' }, { status: 401 });
        // }

        // If everything is valid, allow the request to continue
        return NextResponse.next();
    } catch (error) {
        return NextResponse.json({ error: true, message: error.message }, { status: 500 });
    }
}

// Configure the middleware to only run on certain routes
export const config = {
    matcher: ['/api/admin/:path*', '/api/callouts/:path*'], // Apply middleware to the specified routes
};
