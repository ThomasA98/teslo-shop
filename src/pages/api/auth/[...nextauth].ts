import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { AuthOptions } from 'next-auth'
import { dbUsers } from "@/database"

export const authOptions: AuthOptions = {

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo', type: 'email', placeholder: 'correo@google.com' },
        password: { label: 'Contraseña', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials): Promise<any> {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    })
  ],

  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  jwt: {

  },

  session: {
    maxAge: 2_592_000, // 30 días
    strategy: 'jwt',
    updateAge: 86_400 // cada día
  },

  callbacks: {

    async jwt({ token, account, user }) {

      if (!account) return token;

      token.accessToken = account.access_token;

      switch (account.type) {
        case 'oauth':
          token.user = await dbUsers.oAuthToDbUser(user.email || '', user.name || '');
          break;

        case 'credentials':
          token.user = user;
          break;
      }

      return token;
    },

    async session({ session, token, user }) {

      // session.accessToken = token.accessToken;
      // session.user = token.user as any;

      return {
        ...session,
        accessToken: token.accessToken,
        user: token.user as any
      };
    },

  }
}

export default NextAuth(authOptions)