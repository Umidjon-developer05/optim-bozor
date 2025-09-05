import ScrollToTop from "@/components/shared/scroll-to-top";
import Header from "./_components/header";

async function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />

      <main>{children}</main>
      <ScrollToTop />
    </div>
  );
}

export default layout;
