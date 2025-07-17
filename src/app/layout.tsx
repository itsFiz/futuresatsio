import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FutureSats.io - BTC Retirement Planner",
  description: "Plan your Bitcoin retirement with our advanced BTC accumulation simulator. Set DCA schedules, simulate dip buys, and project your wealth growth through halving cycles.",
  keywords: "Bitcoin, BTC, retirement planning, DCA, halving cycles, wealth accumulation, PWA, mobile app",
  authors: [{ name: "Fiz @ F12.GG" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
  icons: {
    icon: [
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/icon-192x192.png?v=2', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png?v=2', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.ico?v=2',
    apple: [
      { url: '/apple-icon.png?v=2', sizes: '180x180', type: 'image/png' },
      { url: '/icon-192x192.png?v=2', sizes: '192x192', type: 'image/png' }
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FutureSats',
    startupImage: [
      {
        url: '/icon-192x192.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/web-app-manifest-512x512.png',
        media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'FutureSats',
    'msapplication-TileColor': '#f97316',
    'msapplication-TileImage': '/icon-192x192.png',
  },
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192x192.png?v=2" />
        <link rel="apple-touch-icon" sizes="512x512" href="/web-app-manifest-512x512.png?v=2" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-TileImage" content="/icon-192x192.png" />
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
