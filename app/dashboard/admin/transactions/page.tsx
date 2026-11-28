import TransactionsTable from "@/components/dashboard/admin/transactions-table"
import { getServerToken } from "@/lib/session/serverToken"
import type { Payment } from "@/lib/types/payment"

export default async function AdminTransactionsPage() {
  // TODO: fetch every payment here (admin only), newest first.
  // Convert _id to a string and paymentDate to an ISO string before passing them in.
  const token = await getServerToken() // Use the server token for authentication
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch payments")
  }
  const payments: Payment[] = await res.json()

  return <TransactionsTable initialPayments={payments} />
}
