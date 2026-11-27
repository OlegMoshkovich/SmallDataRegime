import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { fontSizeBoot } from "@/lib/font-size";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MI_research_lab",
    template: "%s | MI_research_lab",
  },
  description:
    "Post-train language and policy models from a small, curated set of preferences, traces, and reward specs. Sample efficient. Model agnostic. Fully owned.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased max-lg:overscroll-y-none`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <script dangerouslySetInnerHTML={{ __html: fontSizeBoot }} />
        <Suspense>
          <Header />
        </Suspense>
        <div aria-hidden className="h-[72px] shrink-0" />
        <main className="min-h-[calc(100dvh-72px)]">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
