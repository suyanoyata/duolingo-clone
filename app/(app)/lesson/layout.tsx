import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fluenty",
  description: "Learn languages with ease",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="absolute w-full top-0 left-0 h-screen bg-white">
      {children}
    </main>
  );
}
