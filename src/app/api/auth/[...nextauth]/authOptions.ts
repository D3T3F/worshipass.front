import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials, req) {
        if (!credentials) return null;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                usuario: (credentials as any).user,
                senha: credentials.password,
              }),
              cache: "no-store",
            }
          );

          const data = await response.json();

          if (!data?.token || !data?.user?.id) return null;

          return {
            id: data.user.id?.toString?.() ?? "0",
            name: data.user.nome ?? "",
            email: data.user.usuario ?? credentials.email,
            accessToken: data.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if ((user as any)?.accessToken)
        token.accessToken = (user as any).accessToken;

      return token;
    },

    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;

      if (session.user && token.sub) (session.user as any).email = token.sub;

      return session;
    },
  },
  jwt: {
    maxAge: 60 * 60 * 24,
  },
};
