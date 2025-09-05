// components/layout/header.tsx
"use client";

import UserBox from "@/components/shared/user-box";
import { Button } from "@/components/ui/button";
import { User, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useSession } from "next-auth/react";

const Header: FC = () => {
  const { data } = useSession();
  const sessionUser = data?.currentUser; // AuthUser
  console.log("sessionUser:", sessionUser);
  return (
    <div className="bg-white border-b sticky top-0 left-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              O
            </div>
            <span className="sm:text-2xl font-bold text-purple-600">
              optim bozor
            </span>
          </Link>

          <div className="flex items-center sm:gap-7 gap-2">
            <Button variant="outline" className="sm:block hidden h-[40px]">
              <Link
                href={sessionUser ? "/favorites" : "/sign-in"}
                className="flex items-center gap-1 text-violet-600 hover:text-purple-600"
              >
                <Heart size={20} />
                <span className="hidden md:inline">Saralangan</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-[40px] px-4">
              <Link
                href={sessionUser ? "/cart" : "/sign-in"}
                className="flex items-center gap-1 text-violet-600 hover:text-purple-600"
                aria-label="Savat sahifasiga o‘tish"
              >
                <ShoppingBag size={20} />
                <span className="hidden md:inline">Savat</span>
              </Link>
            </Button>

            {sessionUser ? (
              <UserBox user={sessionUser} />
            ) : (
              <Button
                variant="outline"
                className="h-[40px] px-4"
                aria-label="Kirish"
              >
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1 hover:text-purple-600"
                  aria-label="Kirish"
                >
                  <User size={20} className="text-violet-600" />
                  <span className="hidden md:inline text-violet-600">
                    Kirish
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
