import { NextResponse } from 'next/server';
import prisma from '../../../../../../config/prisma';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key';
// POST: Handle user registration and password reset OTP verification
export async function POST(req: any) {
  const { action, email, otp } = await req.json();

  if (!action || !email || !otp) {
    return NextResponse.json(
      { error: true, message: 'Action, Email, and OTP are required.' },
      { status: 400 }
    );
  }

  try {
    if (action === 'register') {
      // Handle user registration with OTP verification
      const tempUser = await prisma.tempUser.findUnique({
        where: { email },
      });

      if (!tempUser) {
        return NextResponse.json(
          { error: true, message: 'Temporary user not found.' },
          { status: 404 }
        );
      }

      if (tempUser.otp !== otp) {
        return NextResponse.json(
          { error: true, message: 'Invalid OTP.' },
          { status: 400 }
        );
      }

      const newUser = await prisma.user.create({
        data: {
          email: tempUser.email,
          phoneNumber: tempUser.phoneNumber,
          firstName: tempUser.firstName,
          lastName: tempUser.lastName,
          experience: tempUser.experience,
          specialty: tempUser.specialty,
          otpVerified: true,
          password: tempUser.password,
        },
      });

      await prisma.tempUser.delete({
        where: { email },
      });
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
        },
        JWT_SECRET
      );
      return NextResponse.json(
        {
          token,
          user: newUser,
          message: 'User created successfully',
          error: false,
        },
        { status: 200 }
      );
    } else if (action === 'forgetPassword') {
      // Handle password reset OTP verification
      const passwordResetUser = await prisma.passwordReset.findUnique({
        where: { email },
      });

      if (!passwordResetUser) {
        return NextResponse.json(
          { error: true, message: 'user not found.' },
          { status: 404 }
        );
      }

      if (passwordResetUser.otp !== otp) {
        return NextResponse.json(
          { error: true, message: 'Invalid OTP.' },
          { status: 400 }
        );
      }

      await prisma.passwordReset.update({
        where: { email },
        data: { isVerified: true },
      });

      return NextResponse.json(
        { error: false, message: 'User verified successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: true, message: 'Invalid action type.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: 'Error processing request.' },
      { status: 500 }
    );
  }
}
