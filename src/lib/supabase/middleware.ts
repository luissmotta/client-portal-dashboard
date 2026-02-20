import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Get User
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // If no user, redirect to login
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // If user is not the admin, redirect to home
        if (user.email !== 'luissmotta@outlook.com') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 2. Redirect logged in users away from /login
    if (request.nextUrl.pathname.startsWith('/login')) {
        if (user) {
            if (user.email === 'luissmotta@outlook.com') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 3. Protect root route /
    if (request.nextUrl.pathname === '/') {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return response;
}
