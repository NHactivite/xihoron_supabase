
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
  title: "Xihoron",
  description: "An online competition and event management platform",
  generator: "Next.js",
  keywords: ["nextjs", "pwa", "competition", "events"],
  icons: {
    apple: "/icons/512.png",
  },
};

export const viewport = {
  themeColor: "#000000",
};
export default function RootLayout({ children }) {
   
  return (
   <html lang="en" >
    <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <CommonLayout>{children}</CommonLayout>
      </body>
    </html>
   
  );
}
