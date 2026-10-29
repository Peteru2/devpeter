import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";
import { AskPeter } from "@/components/ui/AskPeter";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});
const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
   metadataBase: new URL(site.url || "http://localhost:3000"),
  title: {
    default: "Olatunji Peter (devpeter) — Software Engineer",
    template: "%s · devpeter",
  },
  description:
    "Olatunji Peter (devpeter) is a software engineer in Ogbomoso, Nigeria, building full-stack fintech and edtech products: payments, exams and platforms people depend on every day.",
  openGraph: {
    title: "Olatunji Peter (devpeter) — Software Engineer",
    description:
      "Fintech and edtech products built for real conditions. Open to software engineering roles (remote, Nigeria, Africa) and freelance projects.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body id="top" className="min-h-screen bg-bg font-sans text-ink antialiased">
        <Navbar />
        {children}
        <Footer />
        <AskPeter />
      </body>
    </html>
  );
}