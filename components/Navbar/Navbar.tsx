"use client"

import { usePathname } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import Logo from "./Logo"
import MobileMenu from "./MobileMenu"
import NavButtons from "./NavButtons"
import NavLinks from "./NavLinks"
import ProfileMenu from "./ProfileMenu"

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border-2 border-ink bg-white py-2.5 pr-3 pl-5 shadow-hard">
        <Logo />

        {/* Desktop navigation */}
        <NavLinks className="hidden items-center gap-1 lg:flex" />

        <div className="flex items-center gap-2.5">
          {/* Desktop account actions */}
          <div className="hidden lg:flex">
            {isPending ? (
              <div className="h-11 w-28 animate-pulse rounded-full border-2 border-ink bg-lilac/40" />
            ) : user ? (
              <ProfileMenu user={user} />
            ) : (
              <NavButtons />
            )}
          </div>

          {/* Single mobile menu */}
          <MobileMenu
            key={pathname}
            signedIn={isPending || !!user}
            user={user}
            isPending={isPending}
          />
        </div>
      </div>
    </header>
  )
}
