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
    <main className="flex">
      <Sidebar />
      <main className="ml-[240px] max-sm:ml-0 flex-1">{children}</main>
    </main>
  );
}
