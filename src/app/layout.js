import { CommonLayout } from "@/components/common-layout";
import { ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import { Suspense } from "react";
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
  title: "flower-Shop",
  description: "A full-stack online store for handcrafted wool flower bouquets, featuring a seamless shopping experience with order tracking and customizable gift options",
  generator: "Next.js",
  manifest: "/manifest.json", // ✅ This is enoughy
  icons: {
    apple: "/icons/icon-192x192.png", // ✅ Apple touch icon
  },
};
export const viewport = {
  themeColor: '#ffffff', // ✅ Move it here
};

export default function RootLayout({ children }) {
  return (
   <ClerkProvider>
     <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkLoading>
          <Loading/>
        </ClerkLoading>
        <ReduxProvider>
         <Suspense fallback={<Loading/>}>
                <CommonLayout>{children}</CommonLayout>
              </Suspense>
        </ReduxProvider>
        
      </body>
    </html>
   </ClerkProvider>
  );
}
