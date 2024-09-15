import { DevSidebar } from "@/components/dev-sidebar";
import type { Metadata } from "next";

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
    <main className="flex">
      <DevSidebar />
      {children}
    </main>
  );
}
