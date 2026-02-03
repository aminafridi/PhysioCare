import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LayoutWrapper } from "@/components";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "PhysioCare - Professional Physiotherapy Services",
    template: "%s | PhysioCare",
  },
  description:
    "Professional physiotherapy care tailored to your recovery and wellness. Expert treatment for sports injuries, back pain, post-surgery rehabilitation, and more.",
  keywords: [
    "physiotherapy",
    "physical therapy",
    "sports injury",
    "back pain",
    "rehabilitation",
    "pain relief",
    "physiotherapist",
    "recovery",
  ],
  authors: [{ name: "PhysioCare" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PhysioCare",
    title: "PhysioCare - Professional Physiotherapy Services",
    description:
      "Professional physiotherapy care tailored to your recovery and wellness.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhysioCare - Professional Physiotherapy Services",
    description:
      "Professional physiotherapy care tailored to your recovery and wellness.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
