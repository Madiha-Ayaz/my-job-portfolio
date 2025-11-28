// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SearchProvider } from '@/context/SearchContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Chatbot from '@/components/chatbot/Chatbot';
import Script from 'next/script';

// Fonts
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });


export const metadata: Metadata = {
  title: 'Madiha Ayaz - Full-Stack Developer',
  description: 'A modern portfolio showcasing the projects and skills of Madiha Ayaz, a full-stack developer specializing in Next.js, TypeScript, and Python.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background text-text">
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-P4R0XYCWKQ`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-P4R0XYCWKQ');
            `,
          }}
        />
      </head>
      <body className={inter.variable}>
        <SearchProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
              <Footer />
              <Chatbot />
            </div>
          </AuthProvider>
        </SearchProvider>
      </body>
    </html>
  );
}
