"use client";

import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import { init } from "@noriginmedia/norigin-spatial-navigation";
import { AppSettingsProvider } from "@/providers/AppSettings";
import { AppInfoProvider } from "@/providers/AppInfo";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  init({
    // options
  });

  return (
    <html
      className="h-screen bg-transparent"
      lang="en"
      suppressHydrationWarning
    >
      <body className={`h-full antialiased`}>
        <AppSettingsProvider>
          <AppInfoProvider>
            <Provider>
              <Toaster />
              {children}
            </Provider>
          </AppInfoProvider>
        </AppSettingsProvider>
      </body>
    </html>
  );
}
