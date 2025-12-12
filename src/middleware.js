import { ratelimit } from "./lib/rateLimit";
import { updateSession } from "./lib/supabase/middleware"

export async function middleware(request) {
  if (!ratelimit) {
    console.warn("ratelimit not configured; skipping");
    return await updateSession(request);
  }
   // Choose a key: prefer user-id if available, otherwise IP
  // Try to read supabase auth cookie or session if you already parse it in updateSession.
  // For a generic approach, use IP:
  const xff = request.headers.get("x-forwarded-for");
  const cfIp = request.headers.get("cf-connecting-ip");
  const ip = (xff && xff.split(",")[0].trim()) || cfIp || "anonymous";

  // Optionally include pathname to create different buckets per route
  const url = new URL(request.url);
  const key = `rl:${url.pathname}:${ip}`;

  try {
    const { success } = await ratelimit.limit(key);

    if (!success) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
     console.warn("Rate limit check failed:");
  }

  // proceed to update session (your existing logic)
  return await updateSession(request);
}



export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}