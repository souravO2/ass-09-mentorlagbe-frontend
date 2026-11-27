"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import type { Tuition } from "@/lib/types/tuition"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { cn } from "@/lib/utils"
import PageHeader from "@/components/tuition/page-header"
import Link from "next/link"

type ApprovalStatus = Tuition["approvalStatus"]
type Filter = "all" | ApprovalStatus

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const statusStyle: Record<ApprovalStatus, string> = {
  pending: "bg-lemon text-ink",
  approved: "bg-mint text-ink",
  rejected: "bg-coral text-ink",
}

const fmtFee = (n: number) => `৳${n.toLocaleString("en-US")}`

function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <Badge
      className={cn(
        "rounded-full border-2 border-ink px-3 py-1 font-bold text-ink shadow-none",
        statusStyle[status]
      )}
    >
      {label}
    </Badge>
  )
}

export default function AdminTuitionApprovals({
  initialApplications,
}: {
  initialApplications: Tuition[]
}) {
  const [items, setItems] = useState(initialApplications)
  const [filter, setFilter] = useState<Filter>("all")
  const [busyId, setBusyId] = useState<string | null>(null)

  const [actionTarget, setActionTarget] = useState<{
    tuition: Tuition
    nextStatus: "approved" | "rejected"
  } | null>(null)

  const counts: Record<Filter, number> = {
    all: items.length,
    pending: items.filter((t) => t.approvalStatus === "pending").length,
    approved: items.filter((t) => t.approvalStatus === "approved").length,
    rejected: items.filter((t) => t.approvalStatus === "rejected").length,
  }

  const visible =
    filter === "all" ? items : items.filter((t) => t.approvalStatus === filter)

  function requestApproval(
    tuition: Tuition,
    nextStatus: "approved" | "rejected"
  ) {
    if (busyId) return

    setActionTarget({ tuition, nextStatus })
  }

  async function confirmApproval() {
    if (!actionTarget) return

    const { tuition, nextStatus } = actionTarget

    setActionTarget(null)
    await updateApproval(tuition, nextStatus)
  }

  async function updateApproval(
    tuition: Tuition,
    nextStatus: "approved" | "rejected"
  ) {
    if (busyId) return

    const previousStatus = tuition.approvalStatus

    setBusyId(tuition._id)

    // Optimistically update the UI
    setItems((prev) =>
      prev.map((t) =>
        t._id === tuition._id ? { ...t, approvalStatus: nextStatus } : t
      )
    )

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${tuition._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approvalStatus: nextStatus,
          }),
        }
      )

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message ?? "Could not update tuition approval")
      }

      toast.success(
        nextStatus === "approved" ? "Tuition approved" : "Tuition rejected"
      )
    } catch (error) {
      // Restore the previous status if the request fails
      setItems((prev) =>
        prev.map((t) =>
          t._id === tuition._id ? { ...t, approvalStatus: previousStatus } : t
        )
      )

      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Tuition"
          highlight="approvals"
          description="Approve or reject tutor posts."
        />

        <Badge className="w-fit rounded-full border-2 border-ink bg-lemon px-4 py-1.5 text-sm font-extrabold text-ink shadow-none">
          Admin
        </Badge>
      </header>

      {/* Status filters */}
      <div
        role="group"
        aria-label="Filter tuition approvals"
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
        <div className="rounded-3xl border-2 border-ink bg-white p-10 text-center shadow-hard">
          <h2 className="font-heading text-xl font-black">
            No {filter} tuitions
          </h2>

          <p className="mt-2 text-sm text-ink-soft">
            There are no tuition posts in this category right now.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-3xl border-2 border-ink bg-white p-3 shadow-hard md:block md:p-5">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-ink hover:bg-transparent">
                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Tuition
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Tutor
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Subject
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Fee
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Status
                    </TableHead>

                    <TableHead className="text-right font-extrabold tracking-wide text-ink uppercase">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {visible.map((t) => (
                    <TableRow
                      key={t._id}
                      className="border-b-2 border-ink last:border-b-0"
                    >
                      <TableCell className="min-w-56 py-5 font-bold">
                        <Link
                          href={`/tuitions/${t._id}`}
                          className="hover:underline"
                        >
                          {t.title}
                        </Link>
                      </TableCell>

                      <TableCell className="min-w-36">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold">
                            {t.tutorName || "Unknown tutor"}
                          </span>
                          <span className="text-sm text-ink-soft">
                            {t.tutorEmail}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="flex min-w-32 flex-col">
                        <span className="text-ink">{t.subject}</span>
                        <span className="text-sm text-ink-soft">
                          {t.classLevel}
                        </span>
                      </TableCell>

                      <TableCell className="font-medium">
                        {fmtFee(t.monthlyFee)}
                      </TableCell>

                      <TableCell>
                        <ApprovalBadge status={t.approvalStatus} />
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {t.approvalStatus !== "approved" && (
                            <Button
                              type="button"
                              disabled={busyId !== null}
                              onClick={() => requestApproval(t, "approved")}
                              className="h-10 rounded-full border-2 border-ink bg-mint px-4 font-bold text-ink shadow-hard-sm hover:bg-mint/90"
                            >
                              {busyId === t._id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : t.approvalStatus === "rejected" ? (
                                "Approve"
                              ) : (
                                "Approve"
                              )}
                            </Button>
                          )}

                          {t.approvalStatus !== "rejected" && (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={busyId !== null}
                              onClick={() => requestApproval(t, "rejected")}
                              className="h-10 rounded-full border-2 border-ink bg-white px-4 font-bold text-ink shadow-hard-sm hover:bg-coral"
                            >
                              {busyId === t._id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile cards */}
          <ul className="grid grid-cols-1 gap-4 md:hidden">
            {visible.map((t) => (
              <li
                key={t._id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-white p-5 shadow-hard-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/tuitions/${t._id}`}
                    className="min-w-0 font-heading text-lg leading-tight font-black hover:underline"
                  >
                    {t.title}

                    <p className="mt-1 text-sm text-ink-soft">
                      {t.subject} · {t.classLevel}
                    </p>
                  </Link>

                  <ApprovalBadge status={t.approvalStatus} />
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="min-w-0">
                    <dt className="font-bold text-ink-soft">Tutor</dt>
                    <dd className="wrap-break-words mt-1 font-medium">
                      {t.tutorName || "Unknown tutor"}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="font-bold text-ink-soft">Monthly fee</dt>
                    <dd className="mt-1 font-bold">{fmtFee(t.monthlyFee)}</dd>
                  </div>

                  <div className="col-span-2 min-w-0">
                    <dt className="font-bold text-ink-soft">Tutor email</dt>
                    <dd className="mt-1 font-medium break-all">
                      {t.tutorEmail}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-bold text-ink-soft">Mode</dt>
                    <dd className="mt-1 font-medium">{t.mode}</dd>
                  </div>

                  <div>
                    <dt className="font-bold text-ink-soft">Days per week</dt>
                    <dd className="mt-1 font-medium">{t.daysPerWeek}</dd>
                  </div>

                  <div className="col-span-2">
                    <dt className="font-bold text-ink-soft">Location</dt>
                    <dd className="mt-1 font-medium">
                      {t.location || "Not specified"}
                    </dd>
                  </div>
                </dl>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {t.approvalStatus !== "approved" && (
                    <Button
                      type="button"
                      disabled={busyId !== null}
                      onClick={() => requestApproval(t, "approved")}
                      className="h-11 rounded-full border-2 border-ink bg-mint font-bold text-ink shadow-hard-sm hover:bg-mint/90"
                    >
                      {busyId === t._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  )}

                  {t.approvalStatus !== "rejected" && (
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busyId !== null}
                      onClick={() => requestApproval(t, "rejected")}
                      className="h-11 rounded-full border-2 border-ink bg-white font-bold text-ink shadow-hard-sm hover:bg-coral"
                    >
                      {busyId === t._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Reject"
                      )}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Approval confirmation */}
      <AlertDialog
        open={!!actionTarget}
        onOpenChange={(open) => {
          if (!open && busyId === null) {
            setActionTarget(null)
          }
        }}
      >
        <AlertDialogContent className="rounded-3xl border-2 border-ink bg-white shadow-hard">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-2xl font-black">
              {actionTarget?.nextStatus === "approved"
                ? "Approve this tuition?"
                : "Reject this tuition?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {actionTarget?.nextStatus === "approved"
                ? `“${actionTarget.tuition.title}” will be approved and made available to students.`
                : `“${actionTarget?.tuition.title}” will be rejected and will no longer be available to students.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={busyId !== null}
              className="h-12 rounded-full border-2 border-ink bg-white px-6 font-bold"
            >
              Go back
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={busyId !== null}
              onClick={(event) => {
                event.preventDefault()
                confirmApproval()
              }}
              className={cn(
                "h-12 rounded-full border-2 border-ink px-6 font-bold text-ink shadow-hard-sm",
                actionTarget?.nextStatus === "approved"
                  ? "bg-mint hover:bg-mint/90"
                  : "bg-coral hover:bg-coral/90"
              )}
            >
              {actionTarget?.nextStatus === "approved"
                ? "Yes, approve"
                : "Yes, reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
