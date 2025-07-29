import { clerkClient } from "@clerk/express";

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
    const { userId } = await auth();
  
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Please login" },
        { status: 401 }
      );
    }
  
    const user = await clerkClient.users.getUser(userId);
 
    const role = user.publicMetadata?.role;
  
    if (role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access only" },
        { status: 403 }
      );
    }


  try {
    const { id } = params;

  const body = await request.json();
  const { firstName, lastName, email, phone } = body;
    const res = await fetch(`https://api.clerk.com/v1/users/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email_address: email
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.errors?.[0]?.message || 'Failed to update user');
    }

    const updatedUser = await res.json();

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
