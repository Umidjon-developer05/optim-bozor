"use client";

import UserBox from "@/components/shared/user-box";
import { Button } from "@/components/ui/button";
import { User, Heart, ShoppingBag, LogIn } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { signOut, useSession } from "next-auth/react";
import MobileBottomBar from "./mobile-bottom-bar"; // use relative path to match your snippet

const Header: FC = () => {
  const { data } = useSession();
  const sessionUser = data?.user; // AuthUser
  return (
    <>
      <div className="bg-white/95 supports-[backdrop-filter]:backdrop-blur border-b sticky top-0 left-0 z-50">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center justify-between w-full gap-3">
              <Link href="/" className="flex items-center gap-2 md:gap-3">
                <>
                  <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-1 ring-purple-500/30">
                    O
                  </div>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600">
                    optim bozor
                  </span>
                </>
              </Link>
              {sessionUser ? (
                <Button
                  variant={"outline"}
                  className="sm:hidden mt-2"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogIn />
                  <span>Logout</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="h-[40px] px-4 rounded-xl"
                  aria-label="Kirish"
                >
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-1 hover:text-purple-600"
                  >
                    <User size={20} className="text-violet-600" />
                    <span className="hidden md:inline text-violet-600">
                      Kirish
                    </span>
                  </Link>
                </Button>
              )}
            </div>

            {/* Hide action buttons on mobile and show them only on sm+ */}
            <div className="hidden sm:flex items-center gap-3 md:gap-5 lg:gap-7">
              <Button variant="outline" className="h-[40px] rounded-xl">
                <Link
                  href={sessionUser ? "/favorites" : "/sign-in"}
                  className="flex items-center gap-1 text-violet-600 hover:text-purple-600"
                  aria-label="Saralangan"
                >
                  <Heart size={20} />
                  <span className="hidden md:inline">Saralangan</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-[40px] px-4 rounded-xl"
                aria-label="Savat"
              >
                <Link
                  href={sessionUser ? "/cart" : "/sign-in"}
                  className="flex items-center gap-1 text-violet-600 hover:text-purple-600"
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
                  className="h-[40px] px-4 rounded-xl"
                  aria-label="Kirish"
                >
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-1 hover:text-purple-600"
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

        {/* Mobile-only bottom bar with Saralangan & Savat */}
      </div>
      <MobileBottomBar />
    </>
  );
};

export default Header;
