import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Keep getClaims() immediately after client creation (important for session sync)
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  const userId = claims?.sub ?? null // subject (user id) from claims

  // === PUBLIC ROUTES (allowed without login) ===
  const publicRoutes = [
    '/',
    '/login',
    '/events',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/auth'
  ]
  const path = request.nextUrl.pathname
  const isPublic = publicRoutes.some((route) => path === route || path.startsWith(route + '/')) || publicRoutes.includes(path)

  // Redirect logged-in users away from auth pages (they shouldn't open /login, /register, etc.)
  const authPages = ['/login', '/register', '/forgot-password', '/reset-password', '/auth']
  const isAuthPage = authPages.some((r) => path === r || path.startsWith(r + '/'))

  if (userId && isAuthPage) {
    // if user is logged in, send them to home (or dashboard)
    const url = request.nextUrl.clone()
    url.pathname = '/' // or '/dashboard' or any post-login route
    return NextResponse.redirect(url)
  }

  // 1) Redirect unauthenticated users away from private routes
  if (!userId && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2) Admin-only protection — only run when requested path starts with /admin
  if (path.startsWith('/admin')) {
    // If no user, we already redirected above; but double-check
    if (!userId) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Query minimal profile (role). This query runs server-side with the user's cookies/session.
    // If you use service_role elsewhere, do NOT use it here — this should run with the server client + cookies.
    const { data: profile, error: profileErr } = await supabase
      .from('user_Profiles')
      .select('role')
      .eq('id', userId)
      .single()

    // If there was an error or the user is not admin -> redirect to not-authorized (or home)
    if (profileErr || profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/not-authorized' // create this page or use '/login' or '/'
      return NextResponse.redirect(url)
    }
  }

  // 3) Everything else: allow the request to proceed and keep cookies in sync
  return supabaseResponse
}
