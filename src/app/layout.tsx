
import "./globals.css";
import "./chat-fix.css";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";

// Font replacements for Geist
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SamvadGPT - AI Assistant",
  description:
    "Advanced AI assistant powered by Google Gemini with multi-language support (English, Hindi, Hinglish)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
