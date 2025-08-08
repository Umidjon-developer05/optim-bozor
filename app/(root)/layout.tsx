import ScrollToTop from "@/components/shared/scroll-to-top";
import Header from "./_components/header";
import getUser from "@/lib/getUser";

async function layout({ children }: { children: React.ReactNode }) {
  const session = await getUser();

  return (
    <div>
      <Header session={session?.currentUser} />

      <main>{children}</main>
      <ScrollToTop />
    </div>
  );
}

export default layout;
