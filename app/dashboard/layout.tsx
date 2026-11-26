"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Home, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { dashboardNav, Role } from "@/lib/types/dashboard-nav"
import { RoleBadge } from "@/components/Navbar/ProfileMenu"

const roles: Role[] = ["student", "tutor", "admin"]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const { data: session, isPending } = authClient.useSession()

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const user = session?.user
  const role = (user?.role as Role | undefined) ?? "student"

  // 1. Redirect guests to sign in after session loading finishes.
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in")
    }
  }, [isPending, user, router])

  // 2. Prevent users from accessing another role's dashboard.
  useEffect(() => {
    if (!user) return

    const otherRoles = roles.filter((r) => r !== role)

    if (otherRoles.some((r) => pathname.startsWith(`/dashboard/${r}`))) {
      toast.error("You do not have access to that page")
      router.replace(`/dashboard/${role}`)
    }
  }, [user, role, pathname, router])

  if (isPending || !user) {
    return (
      <div
        role="status"
        className="grid min-h-screen place-items-center bg-paper"
      >
        <div className="size-12 animate-spin rounded-full border-4 border-ink border-t-lemon" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  function toggleSidebar() {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((c) => !c)
    } else {
      setMobileOpen(true)
    }
  }

  function closeMobileDrawer() {
    setMobileOpen(false)
  }

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out")
          router.push("/")
          router.refresh()
        },
        onError: () => {
          toast.error("Could not sign out. Try again.")
        },
      },
    })
  }

  const isActive = (href: string) =>
    href === `/dashboard/${role}`
      ? pathname === href
      : pathname.startsWith(href)

  return (
    <div className="flex h-dvh overflow-hidden bg-paper">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobileDrawer}
          className="fixed inset-0 z-30 bg-ink/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r-2 border-ink bg-white transition-all duration-200 lg:static",
          collapsed && "lg:w-20",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b-2 border-ink px-4">
          <Link
            href="/"
            onClick={closeMobileDrawer}
            className="flex items-center gap-2.5 font-heading text-xl font-black"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border-2 border-ink bg-blue text-sm text-white">
              ML
            </span>

            <span className={cn(collapsed && "lg:hidden")}>MentorLagbe</span>
          </Link>
        </div>

        {/* Dashboard navigation */}
        <nav
          aria-label="Dashboard"
          className="flex flex-1 flex-col gap-2 overflow-y-auto p-3"
        >
          {dashboardNav[role].map(({ href, label, icon: Icon }) => {
            const active = isActive(href)

            return (
              <Link
                key={href}
                href={href}
                title={label}
                onClick={closeMobileDrawer}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 font-bold transition-colors",
                  collapsed && "lg:justify-center lg:px-0",
                  active
                    ? "border-ink bg-lemon shadow-hard-sm"
                    : "border-transparent hover:bg-lemon/50"
                )}
              >
                <Icon className="size-5 shrink-0" aria-hidden="true" />

                <span className={cn(collapsed && "lg:hidden")}>{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Profile summary */}
        <div className="border-t-2 border-ink p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl bg-lilac/40 p-3",
              collapsed && "lg:justify-center lg:p-2"
            )}
          >
            <Avatar className="size-10 shrink-0 border-2 border-ink">
              <AvatarImage src={user.image ?? undefined} alt="" />
              <AvatarFallback className="bg-lilac font-extrabold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
              <p className="truncate text-sm font-bold">{user.name}</p>
              <p className="truncate text-xs text-ink-soft">{user.email}</p>

              <RoleBadge role={role} className="mt-1 inline-block" />
            </div>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            title="Sign Out"
            className={cn(
              "mt-2 flex w-full items-center gap-3 rounded-xl border-2 border-transparent px-3.5 py-3 font-bold hover:bg-coral",
              collapsed && "lg:justify-center lg:px-0"
            )}
          >
            <LogOut className="size-5 shrink-0" aria-hidden="true" />

            <span className={cn(collapsed && "lg:hidden")}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b-2 border-ink bg-paper px-4 md:px-8">
          {/* Sidebar toggle */}
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="grid size-11 place-items-center rounded-full border-2 border-ink bg-white shadow-hard-sm"
          >
            <Menu className="size-5 lg:hidden" aria-hidden="true" />

            {collapsed ? (
              <PanelLeftOpen
                className="hidden size-5 lg:block"
                aria-hidden="true"
              />
            ) : (
              <PanelLeftClose
                className="hidden size-5 lg:block"
                aria-hidden="true"
              />
            )}
          </button>

          {/* Header actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              onClick={closeMobileDrawer}
              className="items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-2 text-sm font-bold shadow-hard-sm flex"
            >
              <Home className="size-4" aria-hidden="true" />
              Home
            </Link>

            <RoleBadge role={role} className="hidden sm:inline-block" />

            <Link
              href="/profile"
              onClick={closeMobileDrawer}
              aria-label="Update profile"
            >
              <Avatar className="size-10 border-2 border-ink">
                <AvatarImage src={user.image ?? undefined} alt="" />
                <AvatarFallback className="bg-lilac font-extrabold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page content — the only scrolling region */}
        <main className="min-w-0 flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
