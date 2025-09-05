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
          if (!data?.user) return null;
          return {
            id: data.user._id,
            email: data.user.email,
            name: data.user.fullName,
            image: data.user.image,
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
        // ❌ XATO:
        // if (account?.provider === "credentials" && user?.name) {
        //   token.userId = user.name as string;
        // }

        // ✅ TO‘G‘RI:
        if (account?.provider === "credentials" && user?.id) {
          token.userId = user.id as string; // ObjectId satr
        }

        if (account?.provider === "google" && user) {
          token.googleEmail = user.email ?? null;
          token.googleName = user.name ?? null;
          token.pendingOAuth = {
            email: user.email,
            fullName: user.name,
          };
        }
        return token;
      } catch (e) {
        console.error("jwt failed:", e);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        const userId = token.userId as string | undefined;
        const pending = token.pendingOAuth as
          | { email?: string | null; fullName?: string | null }
          | undefined;

        if (userId) {
          const { data } = await axiosClient.get<ReturnActionType>(
            `/api/user/profile/${userId}`
          );
          session.currentUser = data.user;
          if (session.user && data.user) {
            session.user.name =
              data.user.fullName ?? data.user.name ?? session.user.name ?? null;
            session.user.email = data.user.email ?? session.user.email ?? null;
            session.user.image = data.user.image ?? session.user.image ?? null;
            // id ni session.user ga ham yozmoqchi bo‘lsangiz:
            (session.user as typeof session.user & { id?: string }).id =
              data.user._id;
          }
          return session;
        }

        // email fallback qismi o‘zingizdagi kabi qoladi...
        if (pending) session.pendingOAuth = pending;
        return session;
      } catch (e) {
        console.error("session failed:", e);
        return session;
      }
    },
  },

  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXT_PUBLIC_JWT_SECRET },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === "true",
};
