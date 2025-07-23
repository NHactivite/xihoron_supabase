import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const { id } = params;

  const body = await request.json();
  const { firstName, lastName, email, phone } = body;

  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        phone_number: phone,
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
