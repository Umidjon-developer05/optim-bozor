import { axiosClient } from "@/http/axios";
import { ReturnActionType } from "@/types";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { userId: { label: "User ID", type: "text" } },
      async authorize(credentials) {
        const { data } = await axiosClient.get<ReturnActionType>(
          `/api/user/profile/${credentials?.userId}`
        );
        return JSON.parse(
          JSON.stringify({ email: data.user.email, name: data.user._id })
        );
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials" && user?.name) {
        token.userId = user.name;
      }
      if (account?.provider === "google" && user) {
        token.pendingOAuth = {
          email: user.email,
          fullName: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      const userId = token?.userId as string | undefined;
      const pendingOAuth = token?.pendingOAuth as
        | { email?: string | null; fullName?: string | null }
        | undefined;

      if (userId) {
        const { data } = await axiosClient.get<ReturnActionType>(
          `/api/user/profile/${userId}`
        );
        session.currentUser = data.user;
        if (session.user) session.user.name = userId;
      }

      if (pendingOAuth) {
        session.pendingOAuth = pendingOAuth;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXT_PUBLIC_JWT_SECRET },
  secret: process.env.NEXT_AUTH_SECRET,
};
