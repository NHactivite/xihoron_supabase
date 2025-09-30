// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { ratelimit } from "./lib/rateLimit";
// // import { ratelimit } from "./lib/rateLimit";
// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/",
//     "/product(.*)",
//     "/about",
//     "/privacy",
//     "/contact",
//     "/search(.*)", 
//   "/manifest.json",
//   "/sw.js",
//   "/favicon.ico",
//   "/icons/(.*)",
//   "/order/payment-verification"

// ]);

// const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// export default clerkMiddleware(async (auth, req) => {

//   //   rate limit logiccccccc------------------
//   // Get the IP address of the requester.
//   // The `x-forwarded-for` header is important for getting the true client IP
//   // when deployed behind a proxy or load balancer.
//  const ip = req.headers.get("x-forwarded-for") ?? req.ip ?? '127.0.0.1';

// // Rate limit the user based on their IP address.
//   const { success, limit, remaining, reset } = await ratelimit.limit(ip);

//   // If the user has exceeded the limit, return a 429 Too Many Requests response.
//   if (!success) {
//     return new NextResponse('Too many requests. Please try again later.', {
//       status: 429,
//       headers: {
//         'X-RateLimit-Limit': limit.toString(),
//         'X-RateLimit-Remaining': remaining.toString(),
//         'X-RateLimit-Reset': new Date(reset).toUTCString(),
//       },
//     });
//   }
// // -----------------------------------------------------------
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
//   // Protect all routes starting with `/admin`

//   if (
//     isAdminRoute(req) &&
//     (await auth()).sessionClaims?.metadata?.role !== "admin"
//   ) {
//     const url = new URL("/", req.url);
//     return NextResponse.redirect(url);
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ratelimit } from "./lib/ratelimit";

// Define the routes that are public and do not require authentication.
const publicRoutes = [
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/product(.*)",
  "/about",
  "/privacy",
  "/contact",
  "/search(.*)",
  "/manifest.json",
  "/sw.js",
  "/favicon.ico",
  "/icons/(.*)",
  "/order/payment-verification"
];

// Define the routes that are protected admin routes.
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Use the clerkMiddleware helper, passing the publicRoutes config.
// Clerk will automatically protect all other routes.
export default clerkMiddleware(async(auth, req) => {
  // --- Rate limit logic ---
  // We keep this custom logic.
  try {
    const ip = req.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return new NextResponse('Too many requests.');
    }
  } catch (error) {
    console.error("Rate limiter failed:", error);
  }
  // --- End of rate limit logic ---


  // --- Custom Admin Route Logic ---
  // If the user tries to access an admin route...
  if (isAdminRoute(req)) {
    // Get the auth state. This is the correct use of auth()
    const { sessionClaims } = auth();

    // ...and they are not an admin, redirect them.
    if (sessionClaims?.metadata?.role !== "admin") {
      const url = new URL("/", req.url);
      return NextResponse.redirect(url);
    }
  }

  // Allow all other requests to proceed.
  // Clerk's middleware will handle the public/private logic.
  return NextResponse.next();

});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};