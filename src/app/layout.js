
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CommonLayout } from "../components/common_layout/index.js";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "xihoron app",
  description: "A Online Competion platform",
  generator: "Next.js",
  manifest: "/manifest.json", 
 keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  icons: {
    apple: "/icons/512.png", 
  },
};
export const viewport = {
  themeColor: '#ffffff', 
};

export default function RootLayout({ children }) {
   
  return (
   <html lang="en" >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
   
  );
}
