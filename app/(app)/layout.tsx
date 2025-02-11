import { Sidebar } from "@/components/sidebar";
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
    <>
      <Sidebar />
      <main className="flex-1 p-1.5 space-y-1.5 max-w-4xl mx-auto">
        {children}
      </main>
    </>
  );
}
