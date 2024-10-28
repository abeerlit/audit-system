import { NextResponse } from 'next/server';
import prisma from '../../../../../config/prisma';
import { sendEmail } from '@/helpers/sendEmail';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-strong-secret-key';
export async function POST(req: any) {
  const requestData = await req.json();

  const { action } = requestData; // Get the action from the parsed data

  if (action === 'register') {
    return await registerUser(requestData);
  } else if (action === 'login') {
    return await loginUser(requestData);
  } else if (action === 'update') {
    return await updateUser(requestData);
  } else if (action === 'forgetPassword') {
    return await forgetPassword(requestData);
  } else {
    return NextResponse.json(
      { error: true, message: 'Invalid action.' },
      { status: 400 }
    );
  }
}

async function updateUser(data: any) {
  const {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    experience,
    specialty,
    profileImage,
  } = data;
  try {
    console.log(profileImage, 'profile image to save');

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'User not found' },
        { status: 401 }
      );
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phoneNumber,
        experience,
        specialty,
        profileImage,
      },
    });
    return NextResponse.json(
      {
        updatedUser: updatedUser,
        error: false,
        message: 'User updated Successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: true, message: error.message || 'Error updating user.' },
      { status: 500 }
    );
  }
}
// User Registration Function
async function registerUser(data: any) {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    experience,
    specialty,
  } = data;

  if (!email) {
    return NextResponse.json(
      { error: true, message: 'Email is required.' },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: true, message: 'Email already exists.' },
        { status: 400 }
      );
    }

    // const otp = Math.floor(1000 + Math.random() * 9000);
    // const otpCode = otp.toString();
    // const emailSent = await sendEmail(
    //   email,
    //   `  <div class="container">
    //     <h1>Verify Your Email</h1>
    //     <p>Hello, ${firstName}</p>
    //     <p>Thank you for signing up for <strong>Audit System</strong>. To complete your registration, please enter the OTP below in the app to verify your email address:</p>

    //     <div class="otp-box">
    //         ${otpCode}
    //     </div>

    //     <p>If you didn’t sign up for an account, you can safely ignore this email.</p>

    //     <p>Thank you,<br>The Audit System Team</p>

    //     <div class="footer">
    //         <p>This is an automated message, please do not reply.</p>
    //         <p>&copy; 2024 Audit System. All rights reserved.</p>
    //     </div>
    // </div>`
    // );
    // if (emailSent?.error) {
    //   return NextResponse.json(
    //     { error: true, message: 'OTP could not be sent' },
    //     { status: 400 }
    //   );
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        phoneNumber,
        firstName,
        lastName,
        experience,
        specialty,
        otpVerified: true,

        // otp: otp,
        password: hashedPassword,
      },
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
        user: newUser,
        token: token,
        error: false,
        message: 'User created successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: true, message: 'Email already exists.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: true, message: 'Error creating user.' },
      { status: 500 }
    );
  }
}

// User Login Function
async function loginUser(data: any) {
  const { email, password } = data;

  if (!email || !password) {
    return NextResponse.json(
      { error: true, message: 'Email and password are required.' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'Invalid email .' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: true, message: 'Invalid  password.' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET
    );
    return NextResponse.json(
      {
        token,
        user: user,
        message: 'Login successful',
        error: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: 'Error logging in.' },
      { status: 500 }
    );
  }
}

async function forgetPassword(data: any) {
  const { email } = data;

  if (!email) {
    return NextResponse.json(
      { error: true, message: 'Email is required.' },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: true, message: 'Email not found.' },
        { status: 404 }
      );
    }

    const userExist = await prisma.passwordReset.findUnique({
      where: { email },
    });

    if (userExist) {
      await prisma.passwordReset.delete({ where: { email } });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);

    await prisma.passwordReset.create({
      data: {
        email: email,
        otp: otp.toString(),
        isVerified: false,

        createdAt: new Date(),
      },
    });

    const emailSent = await sendEmail(
      email,
      `<h1>Hello ${user.firstName}</h1> <p>Your OTP for password reset is: ${otp}\n\nPlease use this code to reset your password. </p>`
    );

    if (emailSent?.error) {
      return NextResponse.json(
        { error: true, message: 'Could not send OTP email.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: false, message: 'OTP sent successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: 'Error processing request.' },
      { status: 500 }
    );
  }
}
