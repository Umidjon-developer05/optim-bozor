"use client";
import { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { login } from "@/actions/auth.action";
import { SessionProvider } from "next-auth/react";

function AutoOAuthLogin() {
  const { data: session, update } = useSession();

  useEffect(() => {
    (async () => {
      const pending = (session as any)?.pendingOAuth; // agar session tipingiz kengaytirilgan bo‘lsa
      const hasUser = (session as any)?.currentUser?._id;
      if (!pending?.email || hasUser) return;

      const res = await login({
        email: pending.email,
        password: "oauth_dummy_password",
      });

      const id = res?.data?.user?._id;
      if (id) {
        await signIn("credentials", { userId: id, redirect: false });
        await update(); // sessiyani yangilash
      }
    })();
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
