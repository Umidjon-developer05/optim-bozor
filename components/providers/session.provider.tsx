"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { login } from "@/actions/auth.action";

function AutoOAuthLogin() {
  const { data: session, update } = useSession();

  useEffect(() => {
    const run = async () => {
      const pending = session?.pendingOAuth;
      const hasUser = session?.currentUser?._id;
      if (!pending?.email || hasUser) return;

      const res = await login({
        email: pending.email,
        password: "oauth_dummy_password",
      });
      const id = res?.data?.user?._id;
      if (id) {
        await signIn("credentials", { userId: id, redirect: false });
        await update(); // /api/auth/session ni qayta olib keladi -> UI ko'radi
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
