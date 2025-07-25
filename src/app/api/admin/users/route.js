
import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
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
    const res = await fetch("https://api.clerk.com/v1/users", {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData?.errors?.[0]?.message || "Failed to fetch users");
    }

    const users = await res.json();
    const admins = users.filter(user => user.public_metadata?.role === 'admin');
    
    return NextResponse.json({ success: true, admins, users:users.length });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}