
import "./globals.css";
import "./chat-fix.css";
import type { Metadata } from "next";

// Use system fonts as fallback to avoid Google Fonts loading issues
const fontVariables = "--font-geist-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; --font-geist-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;";

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
        className="antialiased"
        style={{ fontFamily: fontVariables.includes('--font-geist-sans') ? 'var(--font-geist-sans)' : 'ui-sans-serif, system-ui, sans-serif' }}
      >
        <style dangerouslySetInnerHTML={{ __html: `:root { ${fontVariables} }` }} />
        {children}
      </body>
    </html>
  );
}
