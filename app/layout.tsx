import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import { cn } from "@/lib/utils";
import ClientProviders from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";

const nunito = Nunito({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "Fluenty",
  description: "Learn languages with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(`antialiased min-w-[320px]`, nunito.className)}>
        <SidebarProvider>
          <Toaster />
          <ClientProviders>{children}</ClientProviders>
        </SidebarProvider>
      </body>
    </html>
  );
}
