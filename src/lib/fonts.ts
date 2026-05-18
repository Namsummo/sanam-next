import { Instrument_Sans, Phudu } from "next/font/google";

export const instrumentSans = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const phudu = Phudu({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-phudu",
  display: "swap",
});

export const fontVariables = `${instrumentSans.variable} ${phudu.variable}`;
