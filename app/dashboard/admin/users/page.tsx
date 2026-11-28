import UsersTable from "@/components/dashboard/admin/users-table"
import { getServerToken } from "@/lib/session/serverToken"
import type { AppUser } from "@/lib/types/user"

export default async function AdminUsersPage() {
  // TODO: fetch all users here (admin only).
  // Convert _id to a string and createdAt to an ISO string before passing them in.
  const token = await getServerToken() // Use the server token for authentication
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      // Add any necessary authentication headers here
      authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to load users")
  }
  const users: AppUser[] = await res.json()

  return <UsersTable initialUsers={users} />
}
