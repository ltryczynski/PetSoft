import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { loginFormSchema } from "@/lib/validations";
import { nextAuthEdgeConfig } from "./auth-edge";

const config = {
    ...nextAuthEdgeConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                // runs on login

                // validation
                const validatedFormData = loginFormSchema.safeParse(credentials);
                if (!validatedFormData.success) {
                    return null;
                }

                // extract values
                const { email, password } = validatedFormData.data;

                const user = await getUserByEmail(email);
                if (!user) {
                    console.log("No user found");
                    return null;
                }

                const passwordsMatch = await bcrypt.compare(
                    password,
                    user.hashedPassword
                );
                if (!passwordsMatch) {
                    console.log("Invalid credentials");
                    return null;
                }

                return user;
            },
        }),
    ],
} satisfies NextAuthConfig;

export const {
    auth,
    signIn,
    signOut,
    handlers,
} = NextAuth(config);