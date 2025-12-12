import { getUserSession } from "@/action";
import { createClient } from "./supabase/server";

export async function authenticateAndEnsureAdmin(req) {
  const supabase = await createClient();
  // Read Authorization header if present
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  let claims = null;

  // 1) Try bearer token
  if (bearer) {
    try {
      const user = await validateTokenWithSupabase(supabase, bearer);
      if (user) {
        claims = { sub: user.id, email: user.email };
      }
    } catch (err) {
      console.warn("Token validation error:", err);
    }
  }

  // 2) Fallback to cookie session
  if (!claims) {
    try {
      const sessionResp = await getUserSession();
      if (sessionResp?.data?.claims) {
        claims = sessionResp.data.claims;
      }
    } catch (err) {
      console.error("getUserSession error:", err);
    }
  }

  if (!claims?.sub) {
    return { ok: false, status: 401, body: { success: false, message: "Unauthorized: Please login" } };
  }

  // Now check role in user_Profiles
  try {
    const { data: profile, error: profileErr } = await supabase
      .from("user_Profiles")
      .select("role")
      .eq("id", claims.sub)
      .single();

    if (profileErr) {
      console.error("Supabase profile error:", profileErr);
      return { ok: false, status: 500, body: { success: false, message: "Server error", error: profileErr.message || profileErr } };
    }

    if (!profile || profile.role !== "admin") {
      return { ok: false, status: 403, body: { success: false, message: "Forbidden: Admin access only" } };
    }

    return { ok: true, status: 200, body: { success: true }, claims };
  } catch (err) {
    console.error("Unexpected ensureAdmin error:", err);
    return { ok: false, status: 500, body: { success: false, message: "Server error", error: err.message || err } };
  }
}

async function validateTokenWithSupabase(supabase, token) {
  if (!token) return null;
  // Try supabase.auth.getUser(token) first (v2)
  try {
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (!userErr && userData?.user) {
      return { id: userData.user.id, email: userData.user.email };
    }
  } catch (e) {
    // ignore and try REST fallback
  }

  // REST fallback
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    if (!baseUrl) return null;
    const userRes = await fetch(`${baseUrl}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (userRes.ok) {
      const ud = await userRes.json();
      return { id: ud.id, email: ud.email };
    }
  } catch (e) {
    // ignore
  }
  return null;
}
