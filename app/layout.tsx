import type { Metadata } from "next";
import { Noto_Sans_Mono as Font } from "next/font/google";
import { Provider } from "@/components/provider";

const font = Font({
  variable: "--primary-font",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Torrent Interface",
  description: "A simple torrent interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.variable} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, width: "100%", height: "100vh" }}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
