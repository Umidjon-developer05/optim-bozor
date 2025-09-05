// components/shared/user-box.tsx
"use client";

import { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react";
import { LogIn } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import type { DefaultSession } from "next-auth";

// NextAuth foydalanuvchi tipi (session.user)
type AuthUser = DefaultSession["user"]; // { name?: string | null; email?: string | null; image?: string | null }

interface Props {
  user: AuthUser;
}

const UserBox: FC<Props> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const displayName = user?.name ?? user?.email ?? "User";
  const firstLetter = displayName?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild aria-label="user-profile">
          <Avatar className="cursor-pointer" aria-label="user-profile">
            <AvatarImage src={user?.image ?? undefined} alt={displayName} />
            <AvatarFallback className="capitalize bg-primary text-white">
              {firstLetter}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Mening Akkauntim</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href={"/dashboard"}>Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <LogIn />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Siz Akkauntizdan chiqmoqchimisiz?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Akkauntizdan chiqish orqali siz barcha ma&apos;lumotlaringizni
              yo&apos;qotishingiz mumkin. Agar savollaringiz bo‘lsa, biz bilan
              bog‘laning.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yopish</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => signOut({ callbackUrl: "/sign-in" })}
            >
              Chiqish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserBox;
	