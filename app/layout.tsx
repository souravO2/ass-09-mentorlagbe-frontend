import { Archivo, DM_Sans } from "next/font/google"
import { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SiteChrome from "@/components/shared/SiteChrome"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
})
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })

export const metadata: Metadata = {
  title: {
    default: "MentorLagbe",
    template: "MentorLagbe | %s",
  },
  description:
    "MentorLagbe is a platform that connects students with verified tutors for tuition batches and mentorship.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${dmSans.variable}`}
    >
      <body className="bg-paper font-sans text-ink">
        <ThemeProvider>
          <SiteChrome>{children}</SiteChrome>
        </ThemeProvider>
      </body>
    </html>
  )
}
