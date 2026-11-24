"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Menu, X, LayoutDashboard, UserPen, LogOut } from "lucide-react"
import { toast } from "sonner"

import NavLinks from "./NavLinks"
import NavButtons from "./NavButtons"
import { signOut } from "@/lib/auth-client"
import { RoleBadge } from "./ProfileMenu"

type MobileUser = {
  name: string
  email: string
  image?: string | null
  role?: string | null
}

type MobileMenuProps = {
  signedIn: boolean
  user?: MobileUser
  isPending: boolean
}

export default function MobileMenu({
  signedIn,
  user,
  isPending,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const role =
    user?.role === "tutor" || user?.role === "admin" ? user.role : "student"

  const initials = user?.name
    ?.trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }

    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

  async function handleSignOut() {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      const { error } = await signOut()

      if (error) {
        toast.error(error.message || "Could not sign out. Try again.")
        return
      }

      setOpen(false)
      toast.success("Signed out")
      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Could not sign out. Try again.")
    } finally {
      setIsSigningOut(false)
    }
  }

  function navigate(path: string) {
    setOpen(false)
    router.push(path)
  }

  return (
    <div ref={rootRef} className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative z-[60] grid size-11 place-items-center rounded-full border-2 border-ink bg-lemon shadow-hard-sm"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 -z-10 bg-black/30"
          />

          <div className="absolute top-full right-0 left-0 z-50 max-h-[calc(100dvh_-_6rem)] overflow-y-auto overscroll-contain border-b-2 border-ink bg-paper px-6 pt-6 pb-8 shadow-hard">
            <div className="mx-auto max-w-7xl">
              <NavLinks
                onNavigate={() => setOpen(false)}
                className="flex flex-col gap-2 [&>a]:py-3 [&>a]:text-base"
              />

              {isPending ? (
                <div className="mt-8 h-16 animate-pulse rounded-2xl border-2 border-ink bg-lilac/40" />
              ) : signedIn && user ? (
                <div className="mt-8 border-t-2 border-ink pt-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-ink bg-lilac font-bold">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        initials || "U"
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-extrabold">{user.name}</p>
                      <p className="truncate text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <RoleBadge role={role} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/${role}`)}
                      className="flex items-center gap-3 rounded-xl border-2 border-transparent px-4 py-3 text-left font-bold transition hover:border-ink hover:bg-lilac"
                    >
                      <LayoutDashboard className="size-5" />
                      Dashboard
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-3 rounded-xl border-2 border-transparent px-4 py-3 text-left font-bold transition hover:border-ink hover:bg-lilac"
                    >
                      <UserPen className="size-5" />
                      Edit Profile
                    </button>

                    <button
                      type="button"
                      disabled={isSigningOut}
                      onClick={handleSignOut}
                      className="flex items-center gap-3 rounded-xl border-2 border-transparent px-4 py-3 text-left font-bold text-red-600 transition hover:border-ink hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut className="size-5" />
                      {isSigningOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                </div>
              ) : (
                <NavButtons
                  className="mt-8 flex flex-col [&>a]:py-3"
                  onClick={() => setOpen(false)}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
