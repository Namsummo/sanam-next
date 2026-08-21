import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Giáo xứ Sa Nam",
    template: "%s | Giáo xứ Sa Nam",
  },
  description:
    "Website Giáo xứ Sa Nam — nơi kể về lịch sử, con người và đời sống đức tin của toàn thể cộng đoàn giáo dân Sa Nam: tin tức, sự kiện, phụng vụ, đoàn thể và sinh hoạt giáo xứ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${fontVariables} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
