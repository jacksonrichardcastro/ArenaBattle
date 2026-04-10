import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "ArenaBattle | Head-to-Head Esports",
  description: "Compete in head-to-head matches in your favorite sports and shooter games.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
