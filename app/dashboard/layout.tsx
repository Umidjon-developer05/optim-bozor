import { ChildProps } from "@/types";
import { FC } from "react";
import Sidebar from "./_components/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import MobileSidebar from "./_components/mobile-sidebar";
import { cn } from "@/lib/utils";
import { ArrowBigLeftDash } from "lucide-react";
const Layout: FC<ChildProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/sign-in");

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Sidebar Trigger */}
        <header className="h-16 md:hidden flex justify-between items-center border-b px-4">
          <div className="ml-4 font-semibold flex items-center gap-2">
            <a href="/" className="flex items-center gap-1">
              <ArrowBigLeftDash className="w-5" />
            </a>
            <p>Dashboard</p>
          </div>
          <MobileSidebar />
        </header>

        <main className={cn("flex-1 overflow-y-auto p-4 md:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
