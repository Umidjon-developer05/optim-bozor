"use client";
import { useEffect } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { signIn } from "next-auth/react";
import { login } from "@/actions/auth.action"; // sizdagi endpoint: email+pwd -> user

function AutoOAuthLogin() {
  const { data: session, update } = useSession();

  useEffect(() => {
    const run = async () => {
      const pending = session?.pendingOAuth;
      const hasUser = session?.currentUser?._id;
      if (!pending?.email || hasUser) return;

      // 1) backend'da user'ni yarat/ol (email + dummy password)
      const res = await login({
        email: pending.email,
        password: "oauth_dummy_password",
      });

      // 2) credentials bilan "lokal" sessiyani mustahkamlash
      const id = res?.data?.user?._id;
      if (id) {
        await signIn("credentials", { userId: id, redirect: false });
        await update(); // sessionni qayta yuklab, UI'ga chiqaradi
      }
    };
    run();
  }, [session, update]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AutoOAuthLogin />
      {children}
    </SessionProvider>
  );
}
