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
        try {
          const { data } = await axiosClient.get<ReturnActionType>(
            `/api/user/profile/${credentials?.userId}`
          );
          if (!data?.user) return null; // muhim: xato o‘rniga null qaytaring
          return {
            id: data.user._id,
            email: data.user.email,
            name: data.user._id,
          };
        } catch (e) {
          // throw qilmaslik — aks holda error=Callback bo‘ladi
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  // (ixtiyoriy) keraksiz murakkablik bo‘lmasa, cookie blokini olib tashlashingiz ham mumkin.
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
      try {
        if (account?.provider === "credentials" && user?.name) {
          token.userId = user.name as string;
        }
        if (account?.provider === "google" && user) {
          // ❌ axiosClient.post(...) ni bu yerda QILMAYMIZ
          // JWT callback har chaqirilganda tarmoqga chiqish — xatoga eng katta sabab.
          // Biz faqat pending ma’lumotni saqlaymiz, qolganini Client’dagi AutoOAuthLogin bajaradi.
          token.pendingOAuth = {
            email: user.email,
            fullName: user.name,
          };
        }
        return token;
      } catch (e) {
        console.error("jwt callback failed:", e);
        return token; // throw qilmaymiz
      }
    },

    async session({ session, token }) {
      try {
        const userId = token?.userId as string | undefined;
        const pendingOAuth = token?.pendingOAuth as
          | { email?: string | null; fullName?: string | null }
          | undefined;

        if (userId) {
          const { data } = await axiosClient.get<ReturnActionType>(
            `/api/user/profile/${userId}`
          );
          session.currentUser = data.user;
          if (session.user) {
            session.user.name = userId;
            session.user.email = data.user.email;
          }
        }
        if (pendingOAuth) session.pendingOAuth = pendingOAuth;

        return session;
      } catch (e) {
        console.error("session callback failed:", e);
        return session; // throw qilmaymiz
      }
    },
  },

  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXT_PUBLIC_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
  // Diagnostika uchun:
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
