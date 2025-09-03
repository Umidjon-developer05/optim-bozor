"use client";

import SignUpPage from "@/components/auth/sign-up-page";

export default function Page() {
  return (
    <div className="h-full grid place-items-center p-4">
      <div className="flex flex-col gap-4 w-full ">
        <SignUpPage />
      </div>
    </div>
  );
}
