// lib/authOptions.ts
import { axiosClient } from "@/http/axios";
import { ReturnActionType } from "@/types";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { userId: { label: "User ID", type: "text" } },
      async authorize(credentials) {
        if (!credentials?.userId) return null;

        const { data } = await axiosClient.get<ReturnActionType>(
          `/api/user/profile/${credentials.userId}`
        );

        const u = data.user;
        if (!u) return null;
        const user: User & {
          id: string;
          phone?: string;
          role?: string;
          phone1?: string;
        } = {
          id: u._id,
          email: u.email,
          name: u.fullName,
          phone: u.phone,
          role: u.role,
          image: u.phone1,
        };

        return user;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  cookies: {
    sessionToken: {
      name: "__Host-next-auth.session-token",
      options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    },
    callbackUrl: {
      name: "__Host-next-auth.callback-url",
      options: { secure: true, sameSite: "lax", path: "/" },
    },
    csrfToken: {
      name: "__Host-next-auth.csrf-token",
      options: { secure: true, sameSite: "lax", path: "/" },
    },
    state: {
      name: "__Host-next-auth.state",
      options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    },
    pkceCodeVerifier: {
      name: "__Host-next-auth.pkce.code_verifier",
      options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
    },
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Credentials orqali kirganda: tokenga id/phone/role/sotuvchi yozamiz
      if (account?.provider === "credentials" && user) {
        const u = user;
        token.userId = u.id;
        token.phone = u.phone ?? "";
        token.role = u.role;
      }

      // Google orqali kirganda: onboarding uchun vaqtincha ma'lumot
      if (account?.provider === "google" && user) {
        token.pendingOAuth = { email: user.email, fullName: user.name };
      }

      return token;
    },

    async session({ session, token }) {
      const userId = token?.userId as string | undefined;
      const pendingOAuth = token?.pendingOAuth as
        | { email?: string | null; fullName?: string | null }
        | undefined;

      if (userId) {
        // currentUser'ni to'liq DB'dan olish
        const { data } = await axiosClient.get<ReturnActionType>(
          `/api/user/profile/${userId}`
        );

        session.currentUser = {
          ...data.user,
        };

        // session.user ni ham to'ldirib qo'yamiz
        session.user = session.user ?? {};
        session.user.id = data.user._id;
        session.user.name = data.user.fullName;
        session.user.email = data.user.email;
        session.user.phone = data.user.phone;
        session.user.image = data.user.phone1;
      } else if (token.phone) {
        // fallback: agar fetch qilmasangiz, token'dagi phone'ni qo'yib yuboramiz
        session.user = session.user ?? {};
        session.user.phone = token.phone;
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
