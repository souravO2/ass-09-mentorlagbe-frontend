"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tuition } from "@/lib/types/tuition"
import { Loader2, MapPin, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState } from "react"
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
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import EditForm from "./EditForm"
import { useClientToken } from "@/lib/session/clientToken"

const approvalStyle: Record<Tuition["approvalStatus"], string> = {
  pending: "bg-lemon",
  approved: "bg-mint",
  rejected: "bg-coral",
}

const outlineBtn = "h-9 rounded-full border-2 border-ink bg-white font-bold"

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

const MyTuitionsTable = ({ tuitions }: { tuitions: Tuition[] }) => {
  const token = useClientToken() // Fetch the client token for authentication
  const [items, setItems] = useState(tuitions)
  const [editTarget, setEditTarget] = useState<Tuition | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Tuition | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [statusTarget, setStatusTarget] = useState<{
    tuition: Tuition
    next: boolean
  } | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  function requestStatusChange(t: Tuition) {
    setStatusTarget({
      tuition: t,
      next: !t.isActive,
    })
  }

  async function confirmStatusChange() {
    if (!statusTarget) return

    const { tuition, next } = statusTarget

    setStatusTarget(null)
    await toggleActive(tuition, next)
  }

  async function toggleActive(t: Tuition, next: boolean) {
    setBusyId(t._id)
    replaceItem({ ...t, isActive: next })
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${t._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          }, // Use the client token for authorization
          body: JSON.stringify({ isActive: next }),
        }
      )
      if (!res.ok) throw new Error()
      toast.success(next ? "Tuition is now active" : "Tuition closed")
    } catch {
      replaceItem(t)
      toast.error("Could not change the status")
    } finally {
      setBusyId(null)
    }
  }

  function replaceItem(t: Tuition) {
    setItems((prev) => prev.map((x) => (x._id === t._id ? t : x)))
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          }, // Use the client token for authorization
        }
      )
      if (!res.ok) throw new Error()
      setItems((prev) => prev.filter((x) => x._id !== deleteTarget._id))
      toast.success("Tuition deleted")
      setDeleteTarget(null)
    } catch {
      toast.error("Could not delete the tuition")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      {/* Mobile cards */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((t) => (
          <li
            key={t._id}
            className="flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-ink bg-white p-4 shadow-hard"
          >
            {/* Banner and details */}
            <div className="flex min-w-0 gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.bannerImage}
                alt=""
                className="size-24 shrink-0 rounded-xl border-2 border-ink object-cover"
              />

              <div className="min-w-0 flex-1">
                <h2 className="line-clamp-2 leading-snug font-bold">
                  {t.title}
                </h2>

                <p className="mt-1 text-sm text-ink-soft">
                  {t.subject} · {t.classLevel}
                </p>

                <p className="mt-1 text-sm text-ink-soft">
                  {t.daysPerWeek} days/week · {t.mode}
                </p>

                <p className="mt-2 font-extrabold">
                  ৳{t.monthlyFee.toLocaleString("en-US")}
                  <span className="text-xs font-medium text-ink-soft">
                    {" "}
                    / month
                  </span>
                </p>
              </div>
            </div>

            {/* Location */}
            {t.location && (
              <p className="flex items-start gap-1 text-sm text-ink-soft">
                <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>{t.location}</span>
              </p>
            )}

            {/* Approval and status */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink pt-3">
              <p className="text-xs text-ink-soft">
                Posted {fmtDate(t.createdAt)}
              </p>

              <Badge
                variant="outline"
                className={cn(
                  "rounded-full border-2 border-ink font-extrabold text-ink capitalize",
                  approvalStyle[t.approvalStatus]
                )}
              >
                {t.approvalStatus}
              </Badge>

              <span
                className={cn(
                  "rounded-full border-2 border-ink px-3 py-1 text-xs font-extrabold",
                  t.isActive ? "bg-mint" : "bg-paper"
                )}
              >
                {t.isActive ? "Active" : "Closed"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditTarget(t)}
                className={outlineBtn}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Button>

              <Button
                variant="outline"
                disabled={busyId === t._id}
                onClick={() => requestStatusChange(t)}
                className={cn(outlineBtn, "hover:bg-mint")}
              >
                {busyId === t._id
                  ? "Updating…"
                  : t.isActive
                    ? "Close"
                    : "Activate"}
              </Button>

              <Button
                variant="outline"
                onClick={() => setDeleteTarget(t)}
                className={cn(outlineBtn, "hover:bg-coral")}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop table */}
      <div className="hidden rounded-3xl border-2 border-ink bg-white p-2 shadow-hard lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Banner</TableHead>
              <TableHead>Tuition</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((t) => (
              <TableRow key={t._id}>
                <TableCell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.bannerImage}
                    alt=""
                    className="size-14 rounded-lg border-2 border-ink object-cover"
                  />
                </TableCell>

                <TableCell className="min-w-56">
                  <Link href={`/tuitions/${t._id}`}>
                    <p className="font-bold">{t.title}</p>
                    <p className="text-sm text-ink-soft">
                      {t.subject} · {t.classLevel} · {t.daysPerWeek} days/week
                    </p>
                    <p className="text-xs text-ink-soft">
                      Posted {fmtDate(t.createdAt)}
                    </p>
                  </Link>
                </TableCell>

                <TableCell>
                  <p className="font-semibold">{t.mode}</p>
                  {t.location && (
                    <p className="text-sm text-ink-soft">{t.location}</p>
                  )}
                </TableCell>

                <TableCell className="font-bold">
                  ৳{t.monthlyFee.toLocaleString("en-US")}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full border-2 border-ink font-extrabold text-ink capitalize",
                      approvalStyle[t.approvalStatus]
                    )}
                  >
                    {t.approvalStatus}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-bold">
                    {t.isActive ? "Active" : "Closed"}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditTarget(t)}
                      className={outlineBtn}
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      disabled={busyId === t._id}
                      onClick={() => requestStatusChange(t)}
                      className={cn(outlineBtn, "hover:bg-mint")}
                    >
                      {busyId === t._id
                        ? "Updating…"
                        : t.isActive
                          ? "Close"
                          : "Activate"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setDeleteTarget(t)}
                      className={cn(outlineBtn, "hover:bg-coral")}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-ink bg-white shadow-hard sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl font-black">
              Edit tuition
            </DialogTitle>
            <DialogDescription>
              Update the details of this post.
            </DialogDescription>
          </DialogHeader>
          {editTarget && (
            <EditForm
              key={editTarget._id}
              tuition={editTarget}
              onSaved={replaceItem}
              onClose={() => setEditTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Activate / Close confirmation */}
      <AlertDialog
        open={!!statusTarget}
        onOpenChange={(open) => {
          if (!open) setStatusTarget(null)
        }}
      >
        <AlertDialogContent className="rounded-3xl border-2 border-ink bg-white shadow-hard">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-2xl font-black">
              {statusTarget?.next
                ? "Activate this tuition?"
                : "Close this tuition?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {statusTarget?.next
                ? `“${statusTarget.tuition.title}” will become active and visible to students.`
                : `“${statusTarget?.tuition.title}” will be closed and no longer available to students.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 rounded-full border-2 border-ink bg-white px-6 font-bold">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                confirmStatusChange()
              }}
              className={cn(
                "h-12 rounded-full border-2 border-ink px-6 font-extrabold text-ink shadow-hard",
                statusTarget?.next
                  ? "bg-mint hover:bg-mint/90"
                  : "bg-lemon hover:bg-lemon/90"
              )}
            >
              {statusTarget?.next ? "Yes, activate" : "Yes, close"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-3xl border-2 border-ink bg-white shadow-hard">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-2xl font-black">
              Delete this tuition?
            </AlertDialogTitle>
            <AlertDialogDescription>
              “{deleteTarget?.title}” will be removed permanently. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="h-12 rounded-full border-2 border-ink bg-white px-6 font-bold"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(event) => {
                event.preventDefault()
                confirmDelete()
              }}
              className="h-12 rounded-full border-2 border-ink bg-coral px-6 font-bold text-ink hover:bg-coral/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default MyTuitionsTable
