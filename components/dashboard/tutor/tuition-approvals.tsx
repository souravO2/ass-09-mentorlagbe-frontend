"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import type { Application, ApplicationStatus } from "@/lib/types/application"

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

type Filter = "all" | ApplicationStatus

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
]

const statusStyle: Record<ApplicationStatus, string> = {
  pending: "bg-lemon text-ink",
  accepted: "bg-mint text-ink",
  rejected: "bg-coral text-ink",
}

function ApprovalBadge({ status }: { status: ApplicationStatus }) {
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

export default function ApplicationApprovals({
  initialApplications,
}: {
  initialApplications: Application[]
}) {
  const [items, setItems] = useState(initialApplications)
  const [filter, setFilter] = useState<Filter>("all")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [actionTarget, setActionTarget] = useState<{
    application: Application
    nextStatus: "accepted" | "rejected"
  } | null>(null)

  const counts: Record<Filter, number> = {
    all: items.length,
    pending: items.filter((a) => a.status === "pending").length,
    accepted: items.filter((a) => a.status === "accepted").length,
    rejected: items.filter((a) => a.status === "rejected").length,
  }

  const visible =
    filter === "all" ? items : items.filter((a) => a.status === filter)

  function requestApproval(
    application: Application,
    nextStatus: "accepted" | "rejected"
  ) {
    setActionTarget({ application, nextStatus })
  }

  async function confirmApproval() {
    if (!actionTarget) return

    const { application, nextStatus } = actionTarget

    setActionTarget(null)
    await updateApproval(application, nextStatus)
  }

  async function updateApproval(
    application: Application,
    nextStatus: ApplicationStatus
  ) {
    if (busyId) return

    const previousStatus = application.status

    setBusyId(application._id)

    // Optimistic update
    setItems((prev) =>
      prev.map((a) =>
        a._id === application._id ? { ...a, status: nextStatus } : a
      )
    )

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications/${application._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      )

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message ?? "Could not update application")
      }

      toast.success(
        nextStatus === "accepted"
          ? "Application accepted"
          : "Application rejected"
      )
    } catch (error) {
      // Roll back if the request fails
      setItems((prev) =>
        prev.map((a) =>
          a._id === application._id ? { ...a, status: previousStatus } : a
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
          title="Applicant"
          highlight="reviews"
          description="View and manage applications from students for your tuition posts."
        />

        <Badge className="w-fit rounded-full border-2 border-ink bg-lemon px-4 py-1.5 text-sm font-extrabold text-ink shadow-none">
          Tutor
        </Badge>
      </header>

      {/* Status filters */}
      <div
        role="group"
        aria-label="Filter applications by status"
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
            No {filter} applications
          </h2>

          <p className="mt-2 text-sm text-ink-soft">
            There are no applications in this category right now.
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
                      Student
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Contact
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Schedule
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Note
                    </TableHead>

                    <TableHead className="font-extrabold tracking-wide text-ink uppercase">
                      Tuition
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
                  {visible.map((a) => (
                    <TableRow
                      key={a._id}
                      className="border-b-2 border-ink last:border-b-0"
                    >
                      <TableCell className="min-w-36 py-5 font-bold">
                        {a.studentName}
                      </TableCell>

                      <TableCell className="min-w-56 py-5">
                        <div className="flex flex-col gap-1 font-medium">
                          <span>{a.studentPhone}</span>
                          <span className="text-sm break-all text-ink-soft">
                            {a.studentEmail}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="min-w-36">
                        {a.preferredSchedule || "Not specified"}
                      </TableCell>

                      <TableCell className="max-w-64 min-w-52">
                        <p className="line-clamp-3 text-sm whitespace-normal">
                          {a.studentNote || "No note provided"}
                        </p>
                      </TableCell>

                      <TableCell className="min-w-48">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold">{a.tuitionTitle}</span>
                          <span className="text-sm text-ink-soft">
                            {a.subject}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <ApprovalBadge status={a.status} />
                      </TableCell>

                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {a.status !== "accepted" && (
                            <Button
                              type="button"
                              disabled={busyId === a._id}
                              onClick={() => requestApproval(a, "accepted")}
                              className="h-10 rounded-full border-2 border-ink bg-mint px-4 font-bold text-ink shadow-hard-sm hover:bg-mint/90"
                            >
                              {busyId === a._id ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                "Accept"
                              )}
                            </Button>
                          )}

                          {a.status !== "rejected" && (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={busyId === a._id}
                              onClick={() => requestApproval(a, "rejected")}
                              className="h-10 rounded-full border-2 border-ink bg-white px-4 font-bold text-ink shadow-hard-sm hover:bg-coral"
                            >
                              Reject
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
            {visible.map((a) => (
              <li
                key={a._id}
                className="flex flex-col gap-4 rounded-2xl border-2 border-ink bg-white p-5 shadow-hard-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-heading text-lg leading-tight font-black">
                      {a.studentName}
                    </h2>

                    <p className="mt-1 text-sm text-ink-soft">
                      Applied for {a.tuitionTitle}
                    </p>
                  </div>

                  <ApprovalBadge status={a.status} />
                </div>

                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div className="min-w-0">
                    <dt className="font-bold text-ink-soft">Phone</dt>
                    <dd className="wrap-break-words mt-1 font-medium">
                      {a.studentPhone}
                    </dd>
                  </div>

                  <div className="min-w-0">
                    <dt className="font-bold text-ink-soft">Email</dt>
                    <dd className="mt-1 font-medium break-all">
                      {a.studentEmail}
                    </dd>
                  </div>

                  <div>
                    <dt className="font-bold text-ink-soft">Subject</dt>
                    <dd className="mt-1 font-medium">{a.subject}</dd>
                  </div>

                  <div>
                    <dt className="font-bold text-ink-soft">Schedule</dt>
                    <dd className="mt-1 font-medium">
                      {a.preferredSchedule || "Not specified"}
                    </dd>
                  </div>

                  <div className="col-span-2">
                    <dt className="font-bold text-ink-soft">Student note</dt>
                    <dd className="mt-1 font-medium whitespace-pre-wrap">
                      {a.studentNote || "No note provided"}
                    </dd>
                  </div>
                </dl>

                {a.status !== "accepted" && (
                  <Button
                    type="button"
                    disabled={busyId === a._id}
                    onClick={() => requestApproval(a, "accepted")}
                    className="h-11 rounded-full border-2 border-ink bg-mint font-bold text-ink shadow-hard-sm hover:bg-mint/90"
                  >
                    {busyId === a._id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      "Accept"
                    )}
                  </Button>
                )}

                {a.status !== "rejected" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busyId === a._id}
                      onClick={() => requestApproval(a, "rejected")}
                      className="h-11 rounded-full border-2 border-ink bg-white font-bold text-ink shadow-hard-sm hover:bg-coral"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Accept / Reject confirmation */}
      <AlertDialog
        open={!!actionTarget}
        onOpenChange={(open) => {
          if (!open) setActionTarget(null)
        }}
      >
        <AlertDialogContent className="rounded-3xl border-2 border-ink bg-white shadow-hard">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-2xl font-black">
              {actionTarget?.nextStatus === "accepted"
                ? "Accept this applicant?"
                : "Reject this applicant?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {actionTarget?.nextStatus === "accepted"
                ? `You are about to accept ${actionTarget.application.studentName} for "${actionTarget.application.tuitionTitle}".`
                : `You are about to reject ${actionTarget?.application.studentName}'s application for "${actionTarget?.application.tuitionTitle}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 rounded-full border-2 border-ink bg-white px-6 font-bold">
              Go back
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                confirmApproval()
              }}
              className={cn(
                "h-12 rounded-full border-2 border-ink px-6 font-bold text-ink shadow-hard-sm",
                actionTarget?.nextStatus === "accepted"
                  ? "bg-mint hover:bg-mint/90"
                  : "bg-coral hover:bg-coral/90"
              )}
            >
              {actionTarget?.nextStatus === "accepted"
                ? "Yes, accept"
                : "Yes, reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  )
}
