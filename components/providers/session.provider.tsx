"use client";

import { ReactNode, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import { login } from "@/actions/auth.action";

function AutoOAuthLogin() {
  const { data: session } = useSession();

  useEffect(() => {
    const run = async () => {
      const pending = (session as any)?.pendingOAuth;
      const hasUser = (session as any)?.currentUser?._id;
      if (pending?.email && !hasUser) {
        const res = await login({
          email: pending.email as string,
          password: "oauth_dummy_password",
        });
        if (res?.data?.user?._id) {
          await signIn("credentials", {
            userId: res.data.user._id,
            callbackUrl: "/",
          });
        }
      }
    };
    run();
  }, [session]);

  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AutoOAuthLogin />
      {children}
    </SessionProvider>
  );
}
