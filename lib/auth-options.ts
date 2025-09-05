// src/lib/auth-options.ts
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
        // NextAuth user obyekti
        return {
          id: data.user._id,
          email: data.user.email,
          name: data.user._id,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  // ✅ Cookies: PWA/TWA uchun xavfsiz sozlamalar
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
      if (account?.provider === "credentials" && user?.name) {
        token.userId = user.name; // _id
      }
      if (account?.provider === "google" && user) {
        const { data } = await axiosClient.post<ReturnActionType>(
          "/api/auth/oauth",
          { email: user.email, fullName: user.name }
        );
        token.userId = data.user._id;

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
        const { data } = await axiosClient.get<ReturnActionType>(
          `/api/user/profile/${userId}`
        );
        session.currentUser = data.user;
        if (session.user) {
          session.user.name = userId;
          session.user.email = data.user.email;
        }
      }

      if (pendingOAuth) {
        session.pendingOAuth = pendingOAuth;
      }

      return session;
    },
  },

  session: { strategy: "jwt" },

  // Eslatma: bu ixtiyoriy ichki JWT sir; NextAuth uchun esa quyidagi secret kerak
  jwt: { secret: process.env.NEXT_PUBLIC_JWT_SECRET },

  // ✅ To'g'ri env nomi (oldin xato ko'rinishda edi)
  secret: process.env.NEXTAUTH_SECRET,
};
