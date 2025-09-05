"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { dashboardSidebar } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 left-0 h-screen flex flex-col border-r bg-background shadow-sm">
      <div>
        <div className="flex items-center justify-center h-36 border-b">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-1 ring-purple-500/30">
              O
            </div>
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600">
              optim bozor
            </span>
          </Link>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 px-2">
          <LayoutDashboard className="h-6 w-6" />
          <h1 className="font-bold text-xl">Dashboard</h1>
        </div>
      </div>

      <Separator />

      <div className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {dashboardSidebar.map((item) => (
          <Button
            key={item.route}
            asChild
            variant={pathname === item.route ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-3 px-3 py-6 transition-all",
              pathname === item.route
                ? "font-medium bg-secondary"
                : "hover:bg-secondary/50"
            )}
          >
            <Link href={item.route} className="flex items-center">
              <item.icon className="h-5 w-5 shrink-0" />
              <span>{item.name}</span>
            </Link>
          </Button>
        ))}
      </div>

      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p>© 2025 Company</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
