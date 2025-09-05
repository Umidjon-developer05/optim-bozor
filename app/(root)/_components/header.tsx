// app/_components/header.tsx
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { User, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  const user = session?.currentUser;

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
                href={user ? "/favorites" : "/sign-in"}
                className="flex items-center gap-1 text-violet-600 hover:text-purple-600"
              >
                <Heart size={20} />
                <span className="hidden md:inline">Saralangan</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-[40px] px-4">
              <Link
                href={user ? "/cart" : "/sign-in"}
                className="flex items-center gap-1 text-violet-600 hover:text-purple-600"
                aria-label="Savat sahifasiga o‘tish"
              >
                <ShoppingBag size={20} />
                <span className="hidden md:inline">Savat</span>
              </Link>
            </Button>

            {user ? (
              // <UserBox user={user} />
              <div className="px-3 py-2 rounded border text-violet-600">
                {user.email}
              </div>
            ) : (
              <Button
                variant="outline"
                className="h-[40px] px-4"
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
    </div>
  );
};
export default Header;
