import { NextResponse } from 'next/server';
import prisma from "../../../../config/prisma";
// GET: Fetch all users
export async function GET() {
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


export async function POST(req) {
    const requestData = await req.json();

    const { action } = requestData; // Get the action from the parsed data

    if (action === 'activateOrDeactivate') {
        return await activateOrDeactivate(requestData);
    }
    else if (action === 'update') {
        return await updateUser(requestData);
    }
    else if (action === 'upgrade') {
        return await upgradeUser(requestData);
    }
    else {
        return NextResponse.json(
            { error: true, message: 'Invalid action.' },
            { status: 400 }
        );
    }
}


async function updateUser(data) {
    const { id, firstName, lastName, email, phoneNumber, experience, specialty } = data;
    try {
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
            },
        });
        return NextResponse.json({ updatedUser: updatedUser, error: false, message: "User updated Successfully", }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json(
            { error: true, message: error.message || 'Error updating user.' },
            { status: 500 }
        );
    }
}
async function activateOrDeactivate(data) {
    const { id, email, activate } = data;
    try {
        const user = await prisma.user.findUnique({
            where: { id, email },
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
                isActive: activate ? true : false,
            },
        });
        return NextResponse.json({ updatedUser: updatedUser, error: false, message: "User Upgrade Successfully", }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json(
            { error: true, message: error.message || 'Error updating user.' },
            { status: 500 }
        );
    }
}

async function upgradeUser(data) {
    const { id, email } = data;
    try {
        const user = await prisma.user.findUnique({
            where: { id, email },
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
                role: "expert"
            },
        });
        return NextResponse.json({ updatedUser: updatedUser, error: false, message: "User Upgrade Successfully", }, { status: 201 });
    }
    catch (error) {
        return NextResponse.json(
            { error: true, message: error.message || 'Error updating user.' },
            { status: 500 }
        );
    }
}