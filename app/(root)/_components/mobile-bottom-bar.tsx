"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import type { FC } from "react";
import { Home, Heart, ShoppingBag, User } from "lucide-react";

const isActivePath = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
};

const MobileBottomBar: FC = () => {
  const pathname = usePathname();
  const { data } = useSession();
  const sessionUser = data?.user;

  const favoritesHref = sessionUser ? "/favorites" : "/sign-in";
  const cartHref = sessionUser ? "/cart" : "/sign-in";
  const profileHref = sessionUser ? "/dashboard" : "/sign-in"; // change if needed

  const itemBase =
    "group flex flex-col items-center justify-center gap-1 h-full text-xs font-medium transition-all active:translate-y-[1px]";
  const inactive = "text-gray-500 hover:text-purple-600";
  const active = "text-purple-600 font-semibold";

  return (
    <>
      {/* Fixed bottom nav (mobile only) */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 pb-[env(safe-area-inset-bottom)]"
        aria-label="Pastki navigatsiya"
      >
        <div className="max-w-screen-xl mx-auto">
          <ul className="grid grid-cols-4 h-16">
            <li>
              <Link
                href="/"
                className={`${itemBase} ${
                  isActivePath(pathname, "/") ? active : inactive
                }`}
                aria-current={isActivePath(pathname, "/") ? "page" : undefined}
                aria-label="Bosh sahifa"
              >
                <Home size={24} />
                <span>Uy</span>
              </Link>
            </li>
            <li>
              <Link
                href={favoritesHref}
                className={`${itemBase} ${
                  isActivePath(pathname, "/favorites") ? active : inactive
                }`}
                aria-current={
                  isActivePath(pathname, "/favorites") ? "page" : undefined
                }
                aria-label="Saralangan"
              >
                <Heart size={24} />
                <span>Saralangan</span>
              </Link>
            </li>
            <li>
              <Link
                href={cartHref}
                className={`${itemBase} ${
                  isActivePath(pathname, "/cart") ? active : inactive
                }`}
                aria-current={
                  isActivePath(pathname, "/cart") ? "page" : undefined
                }
                aria-label="Savat"
              >
                <ShoppingBag size={24} />
                <span>Savat</span>
              </Link>
            </li>
            <li>
              <Link
                href={profileHref}
                className={`${itemBase} ${
                  isActivePath(pathname, "/profile") ? active : inactive
                }`}
                aria-current={
                  isActivePath(pathname, "/profile") ? "page" : undefined
                }
                aria-label={sessionUser ? "Profil" : "Kirish"}
              >
                <User size={24} />
                <span>{sessionUser ? "Profil" : "Kirish"}</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Spacer to prevent overlap with fixed bar */}
      <div className="sm:hidden h-16" aria-hidden="true" />
    </>
  );
};

export default MobileBottomBar;
