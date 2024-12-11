import NextAuth, { NextAuthConfig } from 'next-auth';
import bcrypt from 'bcryptjs';
import Credentials from "next-auth/providers/credentials"
import { getUserByEmail } from './server-utils';
import { loginFormSchema } from './validations';


const config = {
    pages: {
        signIn: 'login',
        signOut: 'logout',
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const validation = loginFormSchema.safeParse(credentials);
                if (!validation.success) {
                    return null;
                }
                const { email, password } = validation.data;


                const user = await getUserByEmail(email);
                if (!user) {
                    return null;
                }

                const passwordMatch = await bcrypt.compare(password, user.hashedPassword)
                if (!passwordMatch) {
                    return null;
                }
                return user;
            }

        })],
    callbacks: {
        authorized: ({ auth, request }) => {
            const isLoggedIn = Boolean(auth?.user);
            const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

            if (!isLoggedIn && isTryingToAccessApp) {
                return false;
            }

            if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
                return Response.redirect(new URL("/payment", request.nextUrl));
            }

            if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
                return true;
            }

            if (
                isLoggedIn &&
                (request.nextUrl.pathname.includes("/login") ||
                    request.nextUrl.pathname.includes("/signup")) &&
                auth?.user.hasAccess
            ) {
                return Response.redirect(new URL("/app/dashboard", request.nextUrl));
            }

            if (isLoggedIn && !isTryingToAccessApp && !auth?.user.hasAccess) {
                if (
                    request.nextUrl.pathname.includes("/login") ||
                    request.nextUrl.pathname.includes("/signup")
                ) {
                    return Response.redirect(new URL("/payment", request.nextUrl));
                }

                return true;
            }

            if (!isLoggedIn && !isTryingToAccessApp) {
                return true;
            }

            return false;


        },

        jwt: async ({ token, user, trigger }) => {
            if (user && user.id) {
                token.userId = user.id;
            }
            if (user) {
                token.hasAccess = user.hasAccess;
                token.email = user.email!;
            }
            if (trigger === 'update') {
                const userFromDb = await getUserByEmail(token.email);
                if (userFromDb) {
                    token.hasAccess = userFromDb.hasAccess;
                }

            }

            return token;
        },
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.userId;
                session.user.hasAccess = token.hasAccess;
            }

            return session;
        }

    }
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(config)

