"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/shared/Footer"

/**
 * Renders the marketing Navbar/Footer on every route except the
 * dashboard, which owns the full viewport as a fixed-height app shell
 * (its sidebar provides the navigation there).
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith("/dashboard")) return <>{children}</>

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
