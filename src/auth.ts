import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            async authorize({email, password}) {
                try {

                    const user = await prisma.user.findFirst({
                        where: {email: email as string}
                    })

                    if(!user) {
                        return null
                    }

                    const validPass = bcrypt.compareSync(password as string, user.password)

                    if(!validPass) {
                        return null
                    }
                    
                    return {
                        name: user.full_name,
                        email: user.email,
                        id: String(user.id),
                    };
                } catch (error) {
                    return null;
                }
            }
        })
    ],
    callbacks: {
        // jwt({ token, user }) {
        //     if (user) {
        //         token.accessToken = user.acessToken
        //     }

        //     return token;
        // },
        session({ session, token }) {
            session.user.id = String(token.sub)

            return session
        }
    }
})