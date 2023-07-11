import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

    const session: any = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!session) {

        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();

        url.pathname = '/api/auth/unauthtorized';

        if(req.nextUrl.pathname.startsWith('/api/admin'))
            return NextResponse.redirect(url);

        url.pathname = '/auth/login';
        url.search = `p=${ requestedPage }`;

        return NextResponse.redirect(url);
    }

    const validRole = ['admin'];

    if (req.nextUrl.pathname.startsWith('/admin')
        && !validRole.includes(session.user.role)
    ) return NextResponse.redirect('/');

    if (req.nextUrl.pathname.startsWith('/api/admin')
        && !validRole.includes(session.user.role)
    ) return NextResponse.redirect('/api/auth/unauthtorized');



    // if (req.nextUrl.pathname.startsWith('/checkout')) return checkout(req, ev);

    return NextResponse.next();

}

// const checkout = async (req: NextRequest, ev: NextFetchEvent) => {

// const token = req.cookies.get('token');

//     const { origin, pathname } = req.nextUrl;

//     const notAuthenticatedUrl = `${ origin }/auth/login?p=${ pathname }`;

//     if (!token?.value) return NextResponse.redirect(notAuthenticatedUrl);

//     try {
//         await jwt.isValidToken(token.value);
//         return NextResponse.next();
//     } catch (error) {

//         return NextResponse.redirect(notAuthenticatedUrl)
//     }

// }

export const config = {
    matcher: [
        '/checkout/address',
        '/checkout/summary',
        '/api/admin/:path*',
        '/admin/:path*',
    ]
}