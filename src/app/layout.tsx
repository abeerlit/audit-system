import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import RootLayoutProvider from "./RootLayout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Auditing Dashboard",
  description: "Auditing System for brokers",
  icons: {
    icon: "/logoDark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RootLayoutProvider>{children}</RootLayoutProvider>
      </body>
    </html>
  );
}
