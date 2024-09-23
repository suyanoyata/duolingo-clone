import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lesson 1 - Basics | Fluenty",
  description: "Try practicing your language skills with Lesson 1 - Basics.",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
