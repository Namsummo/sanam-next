import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/animate.css";
import "@/styles/globals.css";

const SITE_DESCRIPTION =
  "Website Giáo xứ Sa Nam — nơi kể về lịch sử, con người và đời sống đức tin của toàn thể cộng đoàn giáo dân Sa Nam: tin tức, sự kiện, phụng vụ, đoàn thể và sinh hoạt giáo xứ.";

export const metadata: Metadata = {
  metadataBase: new URL("https://giaoxusanam.vn"),
  title: {
    default: "Giáo xứ Sa Nam",
    template: "%s | Giáo xứ Sa Nam",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Giáo xứ Sa Nam",
    title: "Giáo xứ Sa Nam",
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/default-cover.jpg", width: 1200, height: 800, alt: "Giáo xứ Sa Nam" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/default-cover.jpg"],
  },
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
