import { jwt } from "@/utils";
import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

    const session = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (!session) {

        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();

        url.pathname = '/auth/login';
        url.search = `p=${ requestedPage }`;

        return NextResponse.redirect(url);
    }

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
    ]
}