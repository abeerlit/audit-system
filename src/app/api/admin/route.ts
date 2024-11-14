import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../config/prisma';
// GET: Fetch all users
export async function GET(req: NextRequest) {
  try {
    // Retrieve the logged-in user's ID from headers or session
    const loggedInUserId = req.nextUrl.searchParams.get('userId'); // Modify as per your source of the user ID

    if (!loggedInUserId) {
      return NextResponse.json(
        { error: true, message: 'User ID is required. fjlsjf' },
        { status: 400 }
      );
    }

    // Fetch all users except the logged-in user
    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: parseInt(loggedInUserId, 10),
        },
      },
    });

    return NextResponse.json({ users: allUsers, error: false, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: true, message: 'Error fetching users.' },
      { status: 500 }
    );
  }
}

export async function POST(req: any) {
  const requestData = await req.json();

  const { action } = requestData; // Get the action from the parsed data

  if (action === 'activateOrDeactivate') {
    return await activateOrDeactivate(requestData);
  } else if (action === 'update') {
    return await updateUser(requestData);
  } else if (action === 'upgrade' || action === 'downgrade') {
    return await upgradeUser(requestData);
  } else {
    return NextResponse.json(
      { error: true, message: 'Invalid action.' },
      { status: 400 }
    );
  }
}

async function updateUser(data: any) {
  const { id, firstName, lastName, email, phoneNumber, experience, specialty } =
    data;
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
async function activateOrDeactivate(data: any) {
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
    return NextResponse.json(
      {
        updatedUser: updatedUser,
        error: false,
        message: 'User Upgrade Successfully',
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

async function upgradeUser(data: any) {
  const { id, email, action } = data;
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
        role : action === 'upgrade' ? 'expert' : 'broker',
      },
    });
    return NextResponse.json(
      {
        updatedUser: updatedUser,
        error: false,
        message: 'User Upgrade Successfully',
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
