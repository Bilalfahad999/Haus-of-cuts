import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haus of Cuts — Premium Barber Experience",
  description:
    "Where precision meets style. Haus of Cuts delivers a luxury grooming experience with expert barbers, premium products, and modern styling.",
  keywords: ["barber", "haircut", "grooming", "luxury barber", "skin fade", "beard trim"],
  openGraph: {
    title: "Haus of Cuts — Premium Barber Experience",
    description: "Where precision meets style. Luxury grooming for the modern gentleman.",
    type: "website",
    locale: "en_AU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-[#080808] text-[#FFFFFF] antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

