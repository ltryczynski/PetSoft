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
                console.log(user);
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
            const user = !!auth?.user;
            const isTryingTOAccessApp = request.nextUrl.pathname.includes('/app');

            if (!user && isTryingTOAccessApp) {
                return false;
            }
            if (user && isTryingTOAccessApp) {
                return true;
            }
            if (user && !isTryingTOAccessApp) {
                return Response.redirect(new URL('/app/dashboard', request.nextUrl));
            }
            if (!user && !isTryingTOAccessApp) {
                return true;
            }

        },

        jwt: ({ token, user }) => {
            if (user && user.id) {
                token.userId = user.id;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.userId;
            }
            return session;
        }

    }
} satisfies NextAuthConfig

export const { auth, signIn, signOut, handlers } = NextAuth(config)

