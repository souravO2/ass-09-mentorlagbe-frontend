"use client"

import { useState } from "react"
import type { ChangeEvent } from "react"
import { DollarSign, GraduationCap, Receipt, Search, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import StatCard from "@/components/dashboard/stat-card"
import EmptyState from "@/components/tuition/empty-state"
import PageHeader from "@/components/tuition/page-header"
import { inputClass } from "@/lib/styles/form-styles"
import type { Payment } from "@/lib/types/payment"
import { cn } from "@/lib/utils"
import UserCell from "../admin/user-cell"
import { RoleBadge } from "@/components/Navbar/ProfileMenu"

type Filter = "all" | Payment["customer_role"]

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "tutor", label: "Tutors" },
  { value: "student", label: "Students" },
]

const fmtMoney = (amount: number, currency = "usd") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)

// Fixed time zone so the server and the browser print the same text
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  })

function PlanBadge({ name }: { name: string }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-2 border-ink bg-mint font-extrabold text-ink"
    >
      {name}
    </Badge>
  )
}

function TransactionId({ id }: { id: string }) {
  return (
    <code
      title={id}
      className="block max-w-72 rounded bg-paper px-2 py-1 font-mono text-xs break-all select-all"
    >
      {id}
    </code>
  )
}

export default function TransactionsTable({
  initialPayments,
}: {
  initialPayments: Payment[]
}) {
  const [filter, setFilter] = useState<Filter>("all")
  const [search, setSearch] = useState("")

  const paid = initialPayments.filter((p) => p.payment_status === "paid")

  const counts: Record<Filter, number> = {
    all: initialPayments.length,
    tutor: initialPayments.filter((p) => p.customer_role === "tutor").length,
    student: initialPayments.filter((p) => p.customer_role === "student")
      .length,
  }

  const revenue = paid.reduce((sum, p) => sum + p.amount, 0)

  const term = search.trim().toLowerCase()
  const visible = initialPayments.filter(
    (p) =>
      (filter === "all" || p.customer_role === filter) &&
      (!term ||
        p.customer_name.toLowerCase().includes(term) ||
        p.customer_email.toLowerCase().includes(term) ||
        p.planName.toLowerCase().includes(term) ||
        p.payment_intent.toLowerCase().includes(term))
  )

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value)
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
      <PageHeader
        title="Transaction"
        highlight="management"
        description="Every Pro plan payment made through Stripe."
      />

      {/* Summary */}
      <section
        aria-label="Payment summary"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          stat={{
            label: "Total revenue",
            value: fmtMoney(revenue),
            icon: DollarSign,
            color: "mint",
          }}
        />
        <StatCard
          stat={{
            label: "Transactions",
            value: initialPayments.length,
            icon: Receipt,
            color: "lilac",
          }}
        />
        <StatCard
          stat={{
            label: "Tutor Pro payments",
            value: counts.tutor,
            icon: GraduationCap,
            color: "sky",
          }}
        />
        <StatCard
          stat={{
            label: "Student Pro payments",
            value: counts.student,
            icon: Users,
            color: "lemon",
          }}
        />
      </section>

      {/* Filters and search */}
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
            aria-label="Search transactions"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name, email or ID"
            className={cn(inputClass, "pl-11")}
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={
            initialPayments.length === 0
              ? "No transactions yet"
              : "No matching transactions"
          }
          description={
            initialPayments.length === 0
              ? "Payments will show up here after someone upgrades to Pro."
              : "Try a different search or role filter."
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-3xl border-2 border-ink bg-white p-2 shadow-hard md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="min-w-60">
                      <UserCell
                        name={p.customer_name}
                        email={p.customer_email}
                      />
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={p.customer_role} />
                    </TableCell>
                    <TableCell>
                      <PlanBadge name={p.planName} />
                    </TableCell>
                    <TableCell className="font-bold">
                      {fmtMoney(p.amount, p.currency)}
                    </TableCell>
                    <TableCell>
                      <TransactionId id={p.payment_intent} />
                    </TableCell>
                    <TableCell className="text-sm font-medium whitespace-nowrap">
                      {fmtDate(p.paymentDate)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <ul className="grid grid-cols-1 gap-4 md:hidden">
            {visible.map((p) => (
              <li
                key={p._id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-white p-5 shadow-hard-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <UserCell name={p.customer_name} email={p.customer_email} />
                  <span className="font-heading text-xl font-black">
                    {fmtMoney(p.amount, p.currency)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <RoleBadge role={p.customer_role} />
                  <PlanBadge name={p.planName} />
                </div>
                <dl className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <dt className="font-bold text-ink-soft">Transaction ID</dt>
                    <dd className="mt-1">
                      <TransactionId id={p.payment_intent} />
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ink-soft">Payment date</dt>
                    <dd className="mt-1 font-medium">
                      {fmtDate(p.paymentDate)}
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
