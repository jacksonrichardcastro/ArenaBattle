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
          <main style={{ minHeight: '80vh' }}>{children}</main>
          <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-dark)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
              <a href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
              <a href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} ArenaBattle. All rights reserved.</p>
          </footer>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
