import type { Metadata } from "next";
import "./globals.css";
import FloatingCircle from "@/components/ui/FloatingCircle";

export const metadata: Metadata = {
  title: "Phisher.ai",
  description: "Created with v0",
  generator: "v0.dev",
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
