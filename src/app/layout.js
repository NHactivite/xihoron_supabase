import { CommonLayout } from "@/components/common-layout";
import { ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

import { Loader } from "@/components/loading";
import Loading from "./loading";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "Xihoron app",
  description: "A Online Competion platform",
  generator: "Next.js",
  manifest: "/manifest.json", 
 keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  icons: {
    apple: "/icons/192.png", 
  },
};
export const viewport = {
  themeColor: '#ffffff', 
};

export default function RootLayout({ children }) {
  return (
   <ClerkProvider   publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
     <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkLoading>
         
         
          <Loading/>
        </ClerkLoading>
                <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
   </ClerkProvider>
  );
}
