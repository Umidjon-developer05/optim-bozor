"use client";

import SignInPage from "@/components/auth/sign-in-page";

export default function Page() {
  return (
    <div className="h-full grid place-items-center p-4">
      <div className="flex flex-col gap-4 w-full max-w-md">
        <SignInPage />
      </div>
    </div>
  );
}
