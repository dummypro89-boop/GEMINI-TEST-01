import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_KR } from "next/font/google";

import "./globals.css";
import { getSiteContent } from "@/lib/content";
import { SiteHeader } from "@/components/site-header";

const garamond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-garamond",
  weight: ["500", "700"]
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "TRULY PILATES",
  description: "TRULY PILATES - Home / About / Program / Instructors / Academy / Contact"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const content = getSiteContent();

  return (
    <html lang="ko">
      <body className={`${garamond.variable} ${notoSansKr.variable} font-body antialiased`}>
        <SiteHeader brand={content.brand} />

        {children}

        <footer className="mt-24 border-t border-sand-200 bg-[#f3e9da]">
          <div className="site-wrap flex flex-wrap items-center justify-between gap-3 py-6 text-sm text-sand-700">
            <p>{content.brand}</p>
            <p>About · Program · Instructors · Academy · Contact</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
