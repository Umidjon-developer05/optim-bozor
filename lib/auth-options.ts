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
        // Credentials flow: _id ni yozamiz
        if (account?.provider === "credentials" && user?.name) {
          token.userId = user.name as string;
        }
        // Google flow: email/name/pending’ni token’ga yozamiz
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
        // lint/SSR’ni yiqitmaslik
        console.error("jwt failed:", e);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        const userId = token.userId as string | undefined;
        const gEmail = token.googleEmail as string | undefined;
        const pending = token.pendingOAuth as
          | { email?: string | null; fullName?: string | null }
          | undefined;

        // 1) _id bo‘yicha profil
        if (userId) {
          const { data } = await axiosClient.get<ReturnActionType>(
            `/api/user/profile/${userId}`
          );
          session.currentUser = data.user;
          if (session.user) {
            session.user.name = userId;
            session.user.email = data.user.email;
          }
          return session;
        }

        // 2) email bo‘yicha fallback (googleEmail -> session.user.email -> pending.email)
        const email = gEmail || session.user?.email || pending?.email;
        if (email) {
          try {
            const { data } = await axiosClient.get<ReturnActionType>(
              `/api/user/by-email/${encodeURIComponent(email)}`
            );
            if (data?.user?._id) {
              session.currentUser = data.user;
              if (session.user) {
                session.user.name = data.user._id;
                session.user.email = data.user.email;
              }
            }
          } catch (e) {
            console.error("session email fetch failed:", e);
          }
        }

        // oldingi: pending && (session.pendingOAuth = pending)
        if (pending) {
          session.pendingOAuth = pending;
        }

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
