import UsersTable from "@/components/dashboard/admin/users-table"
import type { AppUser } from "@/lib/types/user"

export default async function AdminUsersPage() {
  // TODO: fetch all users here (admin only).
  // Convert _id to a string and createdAt to an ISO string before passing them in.
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load users")
  }
  const users: AppUser[] = await res.json()

  return <UsersTable initialUsers={users} />
}
