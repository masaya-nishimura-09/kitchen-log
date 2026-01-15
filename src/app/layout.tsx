import type {Metadata} from "next"
import "@/styles/globals.css"
import {Noto_Sans_JP} from "next/font/google"

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Kitchen Log",
  description:
    "A simple app to manage recipes, meals, stock, and shopping lists — made for everyday kitchen life.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} antialiased`}>{children}</body>
    </html>
  )
}
