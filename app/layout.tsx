import { ChildProps } from "@/types";
import "./globals.css";

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import React, { FC } from "react";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/providers/session.provider";
import NextTopLoader from "nextjs-toploader";
import ClientToast from "@/components/providers/Client";
import { ToastContainer } from "react-toastify";

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.optim-bozor.uz"),
  authors: [{ name: "Optim Bozor", url: "https://www.optim-bozor.uz" }],
  title: "Optim Bozor | Aqlli Savdo Platformasi",
  description:
    "Optim Bozor orqali qulay onlayn xaridlar tajribasini kashf eting. Keng turdagi mahsulotlar, xavfsiz to'lovlar va tez yetkazib berish bilan bir joyda.",
  openGraph: {
    title: "Optim Bozor | Aqlli Savdo Platformasi",
    description:
      "Optim Bozor onlayn xaridlar uchun eng yaxshi platforma. Mahsulotlarimizni ko'rib chiqing, xavfsiz to'lovlar va tez yetkazib berish bilan ta'minlaning.",
    url: "https://www.optim-bozor.uz/",
    locale: "uz-UZ",
    countryName: "Uzbekistan",
    images:
      "https://858yhjxxl1.ufs.sh/f/IyD1Ckboyepa4atoAtH6e5LnruZBVcxURJf3Ilt8SMkoCzHK",
    type: "website",
    emails: "info@optim-bozor.uz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Optim Bozor | Aqlli Savdo Platformasi",
    description:
      "Optim Bozor mahsulotlarining keng assortimenti, xavfsiz to'lovlar va tez yetkazib berish xizmatlari bilan onlayn xaridlar uchun eng yaxshi manzildir.",
  },
};

const RootLayout: FC<ChildProps> = ({ children }) => {
  return (
    <SessionProvider>
      <html lang="uz" suppressHydrationWarning>
        <body
          className={`${montserrat.className} antialiased`}
          suppressHydrationWarning
        >
          <NextTopLoader showSpinner={false} />
          <main>{children}</main>
          <ClientToast />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            theme="colored"
          />
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
};

export default RootLayout;
