"use client"

import { useState } from "react"
import type { ChangeEvent } from "react"
import { toast } from "sonner"
import { Loader2, Search, Users } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import EmptyState from "@/components/tuition/empty-state"
import PageHeader from "@/components/tuition/page-header"
import { useSession } from "@/lib/auth-client"
import {
  inputClass,
  selectContentClass,
  selectItemClass,
} from "@/lib/styles/form-styles"
import type { AppUser, UserRole } from "@/lib/types/user"
import { cn } from "@/lib/utils"
import { RoleBadge } from "@/components/Navbar/ProfileMenu"
import UserCell from "./user-cell"
import { useSearchParams } from "next/navigation"

type Filter = "all" | UserRole

const roles: UserRole[] = ["student", "tutor", "admin"]

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "student", label: "Students" },
  { value: "tutor", label: "Tutors" },
  { value: "admin", label: "Admins" },
]

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

const roleTriggerClass =
  "h-10 w-36 rounded-xl border-2 border-ink bg-white px-3 font-semibold capitalize focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-2"

export default function UsersTable({
  initialUsers,
}: {
  initialUsers: AppUser[]
}) {
  const { data: session } = useSession()
  const meId = session?.user.id
  const searchParams = useSearchParams()

  const statusParam = searchParams.get("status")

  const initialFilter: Filter =
    statusParam === "student" ||
    statusParam === "tutor" ||
    statusParam === "admin"
      ? statusParam
      : "all"

  const [filter, setFilter] = useState<Filter>(initialFilter)
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState("")
  const [pending, setPending] = useState<{
    user: AppUser
    role: UserRole
  } | null>(null)
  const [saving, setSaving] = useState(false)

  const counts = {
    all: users.length,
    student: users.filter((u) => u.role === "student").length,
    tutor: users.filter((u) => u.role === "tutor").length,
    admin: users.filter((u) => u.role === "admin").length,
  }

  const term = search.trim().toLowerCase()
  const visible = users.filter(
    (u) =>
      (filter === "all" || u.role === filter) &&
      (!term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term))
  )

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  async function confirmRoleChange() {
    if (!pending) return

    const { user, role } = pending

    setSaving(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      )

      const result = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(result.message ?? "Could not change the role")
      }

      setUsers((prev) =>
        prev.map((item) => (item._id === user._id ? { ...item, role } : item))
      )

      toast.success("Role updated successfully")
      setPending(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setSaving(false)
    }
  }

  function RoleSelect({ user }: { user: AppUser }) {
    const isMe = user._id === meId

    if (isMe) {
      return (
        <div className="flex items-center gap-2">
          <RoleBadge role={user.role} />
          <span className="text-xs font-bold text-ink-soft">You</span>
        </div>
      )
    }

    return (
      <Select
        value={user.role}
        onValueChange={(value) => {
          if (value !== user.role) setPending({ user, role: value as UserRole })
        }}
      >
        <SelectTrigger
          aria-label={`Change role for ${user.name}`}
          className={roleTriggerClass}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          {roles.map((r) => (
            <SelectItem
              key={r}
              value={r}
              className={cn(selectItemClass, "capitalize")}
            >
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  function PlanBadge({ plan }: { plan: AppUser["plan"] }) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "rounded-full border-2 border-ink font-extrabold text-ink capitalize",
          plan === "pro" ? "bg-mint" : "bg-white"
        )}
      >
        {plan}
      </Badge>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
      <PageHeader
        title="User"
        highlight="management"
        description="See everyone on the platform and change their role."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter by role"
          className="flex flex-wrap gap-2"
        >
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={cn(
                "flex items-center gap-2 rounded-full border-2 border-ink px-4 py-2 text-sm font-bold transition-colors",
                filter === value
                  ? "bg-lemon shadow-hard-sm"
                  : "bg-white hover:bg-lemon/50"
              )}
            >
              {label}
              <span className="grid min-w-6 place-items-center rounded-full border-2 border-ink bg-white px-1 text-xs font-extrabold">
                {counts[value]}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/45"
            aria-hidden="true"
          />
          <Input
            type="search"
            aria-label="Search users"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name or email"
            className={cn(inputClass, "pl-11")}
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description="Try a different search or role filter."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-3xl border-2 border-ink bg-white p-2 shadow-hard md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="min-w-64">
                      <UserCell name={u.name} email={u.email} image={u.image} />
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {u.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <PlanBadge plan={u.plan} />
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {fmtDate(u.createdAt)}
                    </TableCell>
                    <TableCell>
                      <RoleSelect user={u} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <ul className="grid grid-cols-1 gap-4 md:hidden">
            {visible.map((u) => (
              <li
                key={u._id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-white p-5 shadow-hard-sm"
              >
                <UserCell name={u.name} email={u.email} image={u.image} />
                <div className="flex flex-wrap items-center gap-2">
                  <PlanBadge plan={u.plan} />
                  <span className="text-sm font-medium text-ink-soft">
                    Joined {fmtDate(u.createdAt)}
                  </span>
                </div>
                <RoleSelect user={u} />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Confirm role change */}
      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => !open && !saving && setPending(null)}
      >
        <AlertDialogContent className="rounded-3xl border-2 border-ink bg-white shadow-hard">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-2xl font-black">
              Change this user&apos;s role?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.user.name} will change from{" "}
              <strong className="capitalize">{pending?.user.role}</strong> to{" "}
              <strong className="capitalize">{pending?.role}</strong>.
              {pending?.role === "admin" &&
                " Admins can approve tuitions, manage users and see all payments."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={saving}
              className="h-12 rounded-full border-2 border-ink bg-white px-6 font-bold"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(event) => {
                event.preventDefault()
                confirmRoleChange()
              }}
              className="h-12 rounded-full border-2 border-ink bg-lemon px-6 font-extrabold text-ink hover:bg-lemon/90"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Saving…
                </>
              ) : (
                "Change role"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
