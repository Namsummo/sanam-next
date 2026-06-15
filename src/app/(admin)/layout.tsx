import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Quản trị",
    template: "%s | Quản trị Sa Nam",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div data-theme="site" className="min-h-screen">
      {children}
    </div>
  );
}
