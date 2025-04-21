import type { Metadata } from "next";
import "./globals.css";
import FloatingCircle from "@/components/ui/FloatingCircle";

export const metadata: Metadata = {
  title: "Phisher.ai",
  description: "Check your emails for phishing attempts",
  icons: {
    icon: "/icon0.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>\
      <FloatingCircle />
    </html>
  );
}
