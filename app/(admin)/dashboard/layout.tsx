import { DevSidebar } from "@/components/admin/dev-sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex max-sm:flex-col-reverse max-sm:min-h-screen flex-1">
      <DevSidebar />
      <main className="max-sm:ml-0 flex-1">{children}</main>
    </main>
  );
}
