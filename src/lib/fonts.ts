import { Be_Vietnam_Pro, Phudu } from "next/font/google";

export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const phudu = Phudu({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-phudu",
  display: "swap",
});

export const fontVariables = `${beVietnamPro.variable} ${phudu.variable}`;
