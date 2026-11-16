import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/motion/ScrollProgress";
import Loader from "@/components/Loader";
import Backdrop from "@/components/Backdrop";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmed Ouassim Boulouh \u2014 Portfolio",
  description:
    "Computer Science student and full-stack developer building secure, useful products for Algeria.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const initSide = `(function(){try{if(localStorage.getItem("side")==="sec")document.documentElement.dataset.side="sec"}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bricolage.variable} data-side="dev" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initSide }} />
      </head>
      <body>
        <noscript>
          <style>{`.loader{display:none}`}</style>
        </noscript>
        <Loader />
        <Backdrop />
        <ScrollProgress />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}