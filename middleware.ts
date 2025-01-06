import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    if(!request.url.endsWith('/login')) {

        const token = request.cookies.has('token')
        
        if(!token) {
            console.log('redirect from middleware')
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }
    
    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
}