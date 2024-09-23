import type { Metadata } from "next";
import "./globals.css";
import { Nunito } from "next/font/google";
import { cn, db_sync, isDev } from "@/lib/utils";
import ClientProviders from "@/providers/providers";
import { Toaster } from "@/components/ui/sonner";

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
        <Toaster />
        {!db_sync && isDev && (
          <nav className="absolute bottom-0 left-0 w-full h-7 bg-red-400 text-white font-bold text-sm flex items-center justify-center z-50">
            prisma file has unconfirmed database changes, push them with npx
            prisma db push
          </nav>
        )}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
