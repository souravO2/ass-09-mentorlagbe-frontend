"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { FileText, Loader2, X } from "lucide-react"
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
import { Button, buttonVariants } from "@/components/ui/button"
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
import type { Application, ApplicationStatus } from "@/lib/types/application"
import { cn } from "@/lib/utils"
import StatusBadge from "./status-badge"

type Filter = "all" | ApplicationStatus

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

const fmtFee = (n: number) => `৳${n.toLocaleString("en-US")}`

export default function MyApplications({
  initialApplications,
}: {
  initialApplications: Application[]
}) {
  const [items, setItems] = useState(initialApplications)
  const [filter, setFilter] = useState<Filter>("all")
  const [cancelTarget, setCancelTarget] = useState<Application | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const counts = {
    all: items.length,
    pending: items.filter((a) => a.status === "pending").length,
    accepted: items.filter((a) => a.status === "accepted").length,
    rejected: items.filter((a) => a.status === "rejected").length,
  }

  const visible =
    filter === "all" ? items : items.filter((a) => a.status === filter)

  async function confirmCancel() {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${cancelTarget._id}`,
        {
          method: "DELETE",
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? "Could not cancel the application")
      }
      setItems((prev) => prev.filter((a) => a._id !== cancelTarget._id))
      toast.success("Application cancelled")
      setCancelTarget(null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setCancelling(false)
    }
  }

  function CancelButton({ application }: { application: Application }) {
    if (application.status !== "pending") return null
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setCancelTarget(application)}
        className="h-9 rounded-full border-2 border-ink bg-white font-bold hover:bg-coral"
      >
        <X className="size-4" aria-hidden="true" />
        Cancel
      </Button>
    )
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
      <PageHeader
        title="My"
        highlight="applications"
        description="Track every tuition you applied to. You can cancel while it is still pending."
      />

      {/* Status filter */}
      <div
        role="group"
        aria-label="Filter by status"
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

      {visible.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={items.length === 0 ? "No applications yet" : "Nothing here"}
          description={
            items.length === 0
              ? "Find a tuition you like and send your first application."
              : "You have no applications with this status."
          }
          action={
            items.length === 0 ? (
              <Link
                href="/tuitions"
                className={cn(
                  buttonVariants(),
                  "h-11 rounded-full border-2 border-ink bg-lemon px-6 font-extrabold text-ink shadow-hard-sm"
                )}
              >
                Browse Tuitions
              </Link>
            ) : undefined
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden rounded-3xl border-2 border-ink bg-white p-2 shadow-hard md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tuition</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="min-w-56">
                      <Link
                        href={`/tuitions/${a.tuitionId}`}
                        className="font-bold hover:underline"
                      >
                        {a.tuitionTitle}
                      </Link>
                      <p className="text-sm text-ink-soft">{a.subject}</p>
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {a.tutorEmail}
                    </TableCell>
                    <TableCell className="font-bold">
                      {fmtFee(a.monthlyFee)}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {fmtDate(a.appliedAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={a.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <CancelButton application={a} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <ul className="grid grid-cols-1 gap-4 md:hidden">
            {visible.map((a) => (
              <li
                key={a._id}
                className="flex flex-col gap-3 rounded-2xl border-2 border-ink bg-white p-5 shadow-hard-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/tuitions/${a.tuitionId}`}
                    className="font-heading text-lg leading-tight font-black hover:underline"
                  >
                    {a.tuitionTitle}
                  </Link>
                  <StatusBadge status={a.status} />
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="font-bold text-ink-soft">Subject</dt>
                    <dd className="font-medium">{a.subject}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-ink-soft">Fee</dt>
                    <dd className="font-bold">{fmtFee(a.monthlyFee)}</dd>
                  </div>
                  <div className="col-span-2 min-w-0">
                    <dt className="font-bold text-ink-soft">Tutor</dt>
                    <dd className="truncate font-medium">{a.tutorEmail}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="font-bold text-ink-soft">Applied</dt>
                    <dd className="font-medium">{fmtDate(a.appliedAt)}</dd>
                  </div>
                </dl>
                {a.status === "pending" && (
                  <div className="pt-1">
                    <CancelButton application={a} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Cancel confirmation */}
      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && !cancelling && setCancelTarget(null)}
      >
        <AlertDialogContent className="rounded-3xl border-2 border-ink bg-white shadow-hard">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-2xl font-black">
              Cancel this application?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your application for “{cancelTarget?.tuitionTitle}” will be
              removed. You can apply again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={cancelling}
              className="h-12 rounded-full border-2 border-ink bg-white px-6 font-bold"
            >
              Keep it
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cancelling}
              onClick={(event) => {
                event.preventDefault()
                confirmCancel()
              }}
              className="h-12 rounded-full border-2 border-ink bg-coral px-6 font-bold text-ink hover:bg-coral/90"
            >
              {cancelling ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Cancelling…
                </>
              ) : (
                "Cancel application"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
