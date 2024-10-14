import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma';

export async function GET(req, { params }) {
    const { id } = params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'Error fetching user by ID.' },
            { status: 500 }
        );
    }
}
