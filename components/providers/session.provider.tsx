"use client";

import { ChildProps } from "@/types";
import { SessionProvider as Session, useSession } from "next-auth/react";
import { FC, useEffect } from "react";
import { login } from "@/actions/auth.action";
import { signIn } from "next-auth/react";

const AutoOAuthLogin: FC = () => {
  const { data: session } = useSession();
  useEffect(() => {
    const run = async () => {
      const pending = (session as any)?.pendingOAuth;
      const hasUser = (session as any)?.currentUser?._id;
      if (pending?.email && !hasUser && typeof window !== "undefined") {
        const res = await login({
          email: pending.email as string,
          password: "oauth_dummy_password",
        });
        if (res?.data?.user?._id) {
          signIn("credentials", {
            userId: res.data.user._id,
            callbackUrl: "/",
          });
        }
      }
    };
    run();
  }, [session]);
  return null;
};

const SessionProvider: FC<ChildProps> = ({ children }) => {
  return (
    <Session>
      <AutoOAuthLogin />
      {children}
    </Session>
  );
};

export default SessionProvider;
