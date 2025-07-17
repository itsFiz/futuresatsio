import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FutureSats.io - BTC Retirement Planner",
  description: "Plan your Bitcoin retirement with our advanced BTC accumulation simulator. Set DCA schedules, simulate dip buys, and project your wealth growth through halving cycles.",
  keywords: "Bitcoin, BTC, retirement planning, DCA, halving cycles, wealth accumulation",
  authors: [{ name: "Fiz @ F12.GG" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.svg',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="apple-mobile-web-app-title" content="FutureSats" />
      </head>
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <Analytics />
        <ClientProviders>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
