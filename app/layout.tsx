import type { Metadata } from "next";
import { Architects_Daughter, Source_Code_Pro, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { getToken } from "./actions";

const sourceSansPro = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700'], // Changed from Source_Sans_Pro to Source_Sans_3
  variable: '--font-source-sans-pro',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-code-pro',
});

const architectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-architects-daughter',
});

export const metadata: Metadata = {
  title: "Swalang.org",
  description: "Swalang Language Homepage",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();
  return (
    <html lang="en" className={`${sourceSansPro.variable} ${sourceCodePro.variable} ${architectsDaughter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        {/*
          The script below is to prevent a flash of the incorrect theme (FOUC).
          It's placed in the head and runs before React renders.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (
                  localStorage.theme === 'dark' || 
                  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
                ) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-swa-dark transition-colors duration-300">
      <Providers>
          <AuthProvider token={token}>
            <div className="text-gray-700 dark:text-gray-300 font-sans">
              <Header />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html >
  );
}