import { NextResponse } from 'next/server';
import prisma from "../../../../config/prisma";
import { sendEmail } from "@/helpers/sendEmail";
import bcrypt from 'bcrypt';

export async function POST(req) {
    const requestData = await req.json();

    const { action } = requestData; // Get the action from the parsed data

    if (action === 'register') {
        return await registerUser(requestData);
    } else if (action === 'login') {
        return await loginUser(requestData);
    } else if (action === 'forgetPassword') {
        return await forgetPassword(requestData);
    } else {
        return NextResponse.json(
            { error: true, message: 'Invalid action.' },
            { status: 400 }
        );
    }
}

// User Registration Function
async function registerUser(data) {
    const { firstName, lastName, email, password, phoneNumber, experience, specialty } = data;

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

        let otp = Math.floor(1000 + Math.random() * 9000);
        let otpCode = otp.toString();
        let emailSent = await sendEmail(firstName, email, otpCode);
        if (emailSent?.error) {
            return NextResponse.json(
                { error: true, message: 'OTP could not be sent' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.tempUser.create({
            data: {
                email,
                phoneNumber,
                firstName,
                lastName,
                experience,
                specialty,
                otp: otp,
                password: hashedPassword,
            },
        });

        return NextResponse.json(newUser, { error: false, message: "OTP Sent Successfully", status: 201 });
    } catch (error) {
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
async function loginUser(data) {
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

        const { password: _, ...userData } = user;
        return NextResponse.json(userData, { error: false, message: 'Login successful', status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: true, message: 'Error logging in.' },
            { status: 500 }
        );
    }
}


async function forgetPassword(data) {
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

        const otp = Math.floor(1000 + Math.random() * 9000);

        await prisma.passwordReset.create({
            data: {
                email: email,
                otp: otp,
                isVerified: false,

                createdAt: new Date(),
            },
        });

        const emailSent = await sendEmail(
            user.firstName,
            email,
            `Your OTP for password reset is: ${otp}\n\nPlease use this code to reset your password.`
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

// GET: Fetch all users
export async function GET(req) {
    try {
        const allUsers = await prisma.user.findMany();

        return NextResponse.json(allUsers, { error: false, status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: true, message: 'Error fetching users.' },
            { status: 500 }
        );
    }
}
