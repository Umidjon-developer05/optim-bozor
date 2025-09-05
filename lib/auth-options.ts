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
        } catch {
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
          token.userId = user.name as string; // _id
        }
        if (account?.provider === "google" && user) {
          // Tarmoqqa bu yerda chiqmaymiz — faqat pending ma’lumot saqlaymiz
          token.pendingOAuth = {
            email: user.email,
            fullName: user.name,
          };
        }
        return token;
      } catch (e) {
        console.error("jwt failed:", e);
        return token; // throw qilmaslik
      }
    },

    async session({ session, token }) {
      try {
        const userId = token?.userId as string | undefined;
        const pending = token?.pendingOAuth as
          | { email?: string | null; fullName?: string | null }
          | undefined;

        // 1) userId bo‘lsa – profilni _id bo‘yicha oling
        if (userId) {
          const { data } = await axiosClient.get(`/api/user/profile/${userId}`);
          session.currentUser = data.user;
          if (session.user) {
            session.user.name = userId;
            session.user.email = data.user.email;
          }
          return session;
        }

        // 2) userId yo‘q, lekin email bor — email bo‘yicha backend’dan olib ko‘ring (fallback)
        const email = session.user?.email || pending?.email;
        if (email) {
          try {
            // backend’da shunga mos endpoint bo‘lsa:
            const { data } = await axiosClient.get(
              `/api/user/by-email/${encodeURIComponent(email)}`
            );
            if (data?.user?._id) {
              session.currentUser = data.user;
              if (session.user) {
                session.user.name = data.user._id;
                session.user.email = data.user.email;
              }
            }
          } catch {}
        }

        if (pending) session.pendingOAuth = pending;
        return session;
      } catch (e) {
        console.error("session failed:", e);
        return session; // hech bo‘lmasa minimal sessiya qaytsin
      }
    },
  },

  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXT_PUBLIC_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
  // Diagnostika uchun:
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
