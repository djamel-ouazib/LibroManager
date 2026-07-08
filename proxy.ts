import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getSessionCookie } from 'better-auth/cookies'
export async function proxy(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const sessionCookie = getSessionCookie(request)
    if (!sessionCookie) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    if (request.nextUrl.pathname.startsWith('/admin/')) {
        if (session.user.role !== 'admin') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard', '/admin'], // Specify the routes the middleware applies to
}
