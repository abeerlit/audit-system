import { NextResponse } from 'next/server';
import prisma from "../../../../../config/prisma";
import bcrypt from 'bcrypt';

// POST: Update user's password
export async function POST(req) {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
        return NextResponse.json(
            { error: true, message: 'Email,  and new password are required.' },
            { status: 400 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: true, message: 'User not found.' },
                { status: 404 }
            );
        }

        let resetPasswordUser = await prisma.passwordReset.findUnique({
            where: { email },
        });


        if (!resetPasswordUser?.isVerified) {
            return NextResponse.json(
                { error: true, message: 'User not verified.' },
                { status: 404 }
            );
        }


        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { email },
            data: { password: hashedNewPassword },
        });
        await prisma.passwordReset.delete({
            where: { email },
        });

        return NextResponse.json({ error: false, message: 'Password updated successfully.' }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: true, message: 'Error updating password.' },
            { status: 500 }
        );
    }
}
