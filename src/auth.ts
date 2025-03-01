import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Api from "./lib/api";

declare module 'next-auth' {
    interface Session {
        api_token: string;

    }

    interface User {
        acessToken: string
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(formData) {
                try {
                    const { data } = await Api.post('auth', {
                        email: formData.email,
                        password: formData.password
                    });

                    return {
                        name: data.user.fullName,
                        email: data.user.email,
                        id: String(data.user.id),
                        acessToken: data.token
                    };
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.accessToken = user.acessToken
            }

            return token;
        },
        session({ session, token }) {
            session.api_token = String(token.accessToken)

            return session
        }
    }
})