
import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = params;
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
    const res = await fetch(`https://api.clerk.com/v1/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.errors?.[0]?.message || 'Failed to delete user');
    }

    return NextResponse.json({ success: true, message: `User deleted` });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


// app/api/update-user/[id]/route.ts
