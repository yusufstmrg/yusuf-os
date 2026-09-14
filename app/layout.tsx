import type { Metadata } from "next";

import "./globals.css";
import "./overrides.css";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { SpeedInsights } from '@vercel/speed-insights/next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yusuf-platform.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Yusuf B. Situmorang — Finance × Business × AI",
  description: "Yusuf B. Situmorang — finance professional, builder and lifelong learner exploring finance, business, AI and growth.",
  keywords: ["Yusuf B. Situmorang","Finance","Accounting","Tax","Corporate Finance","AI","Business"],
  authors: [{ name: "Yusuf B. Situmorang" }],
  creator: "Yusuf B. Situmorang",
  publisher: "Yusuf B. Situmorang",
  alternates: { canonical: siteUrl },
  openGraph: { title: "Yusuf B. Situmorang — Finance × Business × AI", description: "Finance × Business × AI × Growth.", url: siteUrl, siteName: "Yusuf B. Situmorang", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", title: "Yusuf B. Situmorang — Finance × Business × AI", description: "Finance × Business × AI × Growth." },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org", "@type": "Person", name: "Yusuf B. Situmorang", url: siteUrl,
  jobTitle: "Finance Professional",
  homeLocation: { "@type": "Place", name: "Kebayoran Baru, Jakarta Selatan, Indonesia" },
  sameAs: ["https://www.linkedin.com/in/yusufbsitumorang/","https://www.instagram.com/yusufstmrg/","https://www.tiktok.com/@yusufstmrg","https://www.youtube.com/@yusufstmrg","https://github.com/yusufstmrg"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      
      <body>
        <script key={Math.random()} dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("yusuf-theme");if(t!=="light"&&t!=="dark")t="dark";document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme="dark";document.documentElement.style.colorScheme="dark";}})()` }} />
        
        {children}
        
        {/* Internal Private OS Analytics Tracker */}
        {/* <AnalyticsTracker /> */}
        
        <SpeedInsights />
        
        <script key={Math.random()} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      </body>
    </html>
  );
}
