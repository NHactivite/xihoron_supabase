// /app/api/admin/users/[id]/route.js
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = params;

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
