import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/prisma';
import bcrypt from 'bcrypt';

// POST: Update user's password
export async function POST(req: any) {
  const { email, newPassword, oldPassword } = await req.json();
  console.log(oldPassword, 'old password');

  if (!email || !newPassword) {
    return NextResponse.json(
      { error: true, message: 'Email,  and new password are required.' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'User not found.' },
        { status: 404 }
      );
    }

    if (oldPassword) {
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: true, message: 'Invalid  current password.' },
          { status: 401 }
        );
      }
    } else {
      const resetPasswordUser = await prisma.passwordReset.findUnique({
        where: { email },
      });

      if (!resetPasswordUser?.isVerified) {
        return NextResponse.json(
          { error: true, message: 'User not verified.' },
          { status: 404 }
        );
      }
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { email },
      data: { password: hashedNewPassword },
    });
    if (oldPassword === null || oldPassword === undefined) {
      await prisma.passwordReset.delete({
        where: { email },
      });
    }
    return NextResponse.json(
      { error: false, message: 'Password updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: 'Error updating password.' },
      { status: 500 }
    );
  }
}
