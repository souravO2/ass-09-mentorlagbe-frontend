"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LayoutDashboard, UserPen, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type Role = "student" | "tutor" | "admin"

const roleStyle: Record<Role, string> = {
  student: "bg-lilac",
  tutor: "bg-mint",
  admin: "bg-lemon",
}

export function RoleBadge({
  role,
  className,
}: {
  role: Role
  className?: string
}) {
  return (
    <span
      className={cn(
        "rounded-full border-2 border-ink px-2.5 py-0.5 text-xs font-extrabold capitalize",
        roleStyle[role],
        className
      )}
    >
      {role}
    </span>
  )
}

type User = {
  name: string
  email: string
  image?: string | null
  role?: string | null
}

export default function ProfileMenu({ user }: { user: User }) {
  const router = useRouter()
  const role: Role =
    user.role === "tutor" || user.role === "admin" ? user.role : "student"
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  async function handleSignOut() {
    try {
      await signOut()

      toast.success("Signed out")
      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Could not sign out. Try again.")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="flex items-center gap-2.5 rounded-full border-2 border-ink bg-white py-1 pr-3 pl-1 shadow-hard-sm outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
      >
        <Avatar className="size-9 border-2 border-ink">
          <AvatarImage src={user.image ?? undefined} alt="" />
          <AvatarFallback className="bg-lilac font-extrabold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-32 truncate text-sm font-bold md:block">
          {user.name}
        </span>
        <RoleBadge role={role} className="hidden md:inline-block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-2xl border-2 border-ink bg-white p-2 shadow-hard"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-1.5 p-3">
            <span className="truncate font-bold">{user.name}</span>
            <span className="truncate text-xs font-normal text-ink-soft">
              {user.email}
            </span>
            <RoleBadge role={role} className="w-fit" />
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-ink/20" />
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/${role}`)}
          className="cursor-pointer rounded-xl p-3 font-semibold focus:bg-lemon"
        >
          <LayoutDashboard className="size-4" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => router.push("/profile")}
          className="cursor-pointer rounded-xl p-3 font-semibold focus:bg-lemon"
        >
          <UserPen className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-ink/20" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer rounded-xl p-3 font-semibold focus:bg-coral"
        >
          <LogOut className="size-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
