import "./globals.css";
import "./chat-fix.css";
import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google";

const poppins = Poppins({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-mono",
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
        className={`${poppins.variable} ${firaCode.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
