import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FutureSats.io - BTC Retirement Planner",
  description: "Plan your Bitcoin retirement with our advanced BTC accumulation simulator. Set DCA schedules, simulate dip buys, and project your wealth growth through halving cycles.",
  keywords: "Bitcoin, BTC, retirement planning, DCA, halving cycles, wealth accumulation",
  authors: [{ name: "Fiz @ F12.GG" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-900 text-white`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  );
}
