"use client"

import { useState } from "react"
import type { ChangeEvent, FormEvent, ReactNode } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, MapPin, Pencil, Trash2 } from "lucide-react"
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
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { classLevels, modes, subjects, Tuition } from "@/lib/types/tuition"

const approvalStyle: Record<Tuition["approvalStatus"], string> = {
  pending: "bg-lemon",
  approved: "bg-mint",
  rejected: "bg-coral",
}

const inputClass =
  "h-12 w-full rounded-xl border-2 border-ink bg-white px-4 font-medium placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-2 disabled:bg-paper"

const selectTriggerClass =
  "h-12 w-full rounded-xl border-2 border-ink bg-white px-4 font-semibold focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-2"

const selectContentClass =
  "rounded-xl border-2 border-black bg-white p-1 shadow-[4px_4px_0_black]"

const selectItemClass =
  "cursor-pointer rounded-lg font-semibold focus:bg-[#CBB8FF] focus:text-black data-[state=checked]:bg-lemon"

const textareaClass =
  "min-h-40 w-full resize-y rounded-xl border-2 border-ink bg-white px-4 py-3 font-medium placeholder:text-ink/45 focus-visible:ring-2 focus-visible:ring-lilac focus-visible:ring-offset-2"

const outlineBtn = "h-9 rounded-full border-2 border-ink bg-white font-bold"

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })

/* ---------------------------------- Edit ---------------------------------- */

type EditState = {
  title: string
  subject: string
  classLevel: string
  mode: Tuition["mode"]
  location: string
  monthlyFee: string
  daysPerWeek: string
  description: string
}

type EditErrors = Partial<Record<keyof EditState, string>>

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-extrabold tracking-tight">
        {label}
      </Label>
      {children}
      {error && (
        <p role="alert" className="text-sm font-bold text-[#B3261E]">
          {error}
        </p>
      )}
    </div>
  )
}

function EditForm({
  tuition,
  onSaved,
  onClose,
}: {
  tuition: Tuition
  onSaved: (t: Tuition) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<EditState>({
    title: tuition.title,
    subject: tuition.subject,
    classLevel: tuition.classLevel,
    mode: tuition.mode,
    location: tuition.location,
    monthlyFee: String(tuition.monthlyFee),
    daysPerWeek: String(tuition.daysPerWeek),
    description: tuition.description,
  })
  const [errors, setErrors] = useState<EditErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function setField<K extends keyof EditState>(key: K, value: EditState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleTextChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function handleModeChange(value: string) {
    if (value !== "Online" && value !== "Offline") return
    setField("mode", value)
    if (value === "Online") setField("location", "")
  }

  function validateForm() {
    const nextErrors: EditErrors = {}

    if (form.title.trim().length < 5)
      nextErrors.title = "Title must be at least 5 characters"
    if (!form.subject) nextErrors.subject = "Choose a subject"
    if (!form.classLevel) nextErrors.classLevel = "Choose a class level"
    if (form.mode === "Offline" && !form.location.trim())
      nextErrors.location = "Location is required for offline tuition"

    const fee = Number(form.monthlyFee)
    if (!form.monthlyFee || !Number.isFinite(fee) || fee < 100)
      nextErrors.monthlyFee = "Minimum fee is ৳100"

    const days = Number(form.daysPerWeek)
    if (!form.daysPerWeek || !Number.isInteger(days) || days < 1 || days > 7)
      nextErrors.daysPerWeek = "Enter a number between 1 and 7"

    if (form.description.trim().length < 30)
      nextErrors.description = "Description must be at least 30 characters"

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    if (!validateForm()) {
      toast.error("Please check the form fields")
      return
    }

    const changes = {
      title: form.title.trim(),
      subject: form.subject,
      classLevel: form.classLevel,
      mode: form.mode,
      location: form.mode === "Online" ? "" : form.location.trim(),
      monthlyFee: Number(form.monthlyFee),
      daysPerWeek: Number(form.daysPerWeek),
      description: form.description.trim(),
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${tuition._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        }
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? "Could not update the tuition")
      }
      onSaved({ ...tuition, ...changes })
      toast.success("Tuition updated")
      onClose()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2"
    >
      <Field
        id="e-title"
        label="Title"
        error={errors.title}
        className="sm:col-span-2"
      >
        <Input
          id="e-title"
          name="title"
          value={form.title}
          onChange={handleTextChange}
          className={inputClass}
        />
      </Field>

      <Field id="e-subject" label="Subject" error={errors.subject}>
        <Select
          value={form.subject}
          onValueChange={(value) => {
            if (value) setField("subject", value)
          }}
        >
          <SelectTrigger id="e-subject" className={selectTriggerClass}>
            <SelectValue placeholder="Choose a subject" />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {subjects.map((subject) => (
              <SelectItem
                key={subject}
                value={subject}
                className={selectItemClass}
              >
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="e-classLevel" label="Class level" error={errors.classLevel}>
        <Select
          value={form.classLevel}
          onValueChange={(value) => {
            if (value) setField("classLevel", value)
          }}
        >
          <SelectTrigger id="e-classLevel" className={selectTriggerClass}>
            <SelectValue placeholder="Choose class or level" />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {classLevels.map((level) => (
              <SelectItem key={level} value={level} className={selectItemClass}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="e-mode" label="Mode">
        <Select
          value={form.mode}
          onValueChange={(value) => {
            if (value) handleModeChange(value)
          }}
        >
          <SelectTrigger id="e-mode" className={selectTriggerClass}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {modes.map((mode) => (
              <SelectItem key={mode} value={mode} className={selectItemClass}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field id="e-monthlyFee" label="Monthly fee" error={errors.monthlyFee}>
        <Input
          id="e-monthlyFee"
          name="monthlyFee"
          type="number"
          inputMode="numeric"
          min={100}
          value={form.monthlyFee}
          onChange={handleTextChange}
          className={inputClass}
        />
      </Field>

      <Field
        id="e-daysPerWeek"
        label="Days per week"
        error={errors.daysPerWeek}
      >
        <Input
          id="e-daysPerWeek"
          name="daysPerWeek"
          type="number"
          inputMode="numeric"
          min={1}
          max={7}
          value={form.daysPerWeek}
          onChange={handleTextChange}
          className={inputClass}
        />
      </Field>

      {form.mode === "Offline" && (
        <Field
          id="e-location"
          label="Location"
          error={errors.location}
          className="sm:col-span-2"
        >
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/45" />
            <Input
              id="e-location"
              name="location"
              value={form.location}
              onChange={handleTextChange}
              placeholder="Area, city"
              className={cn(inputClass, "pl-11")}
            />
          </div>
        </Field>
      )}

      <Field
        id="e-description"
        label="Description"
        error={errors.description}
        className="sm:col-span-2"
      >
        <Textarea
          id="e-description"
          name="description"
          value={form.description}
          onChange={handleTextChange}
          rows={6}
          className={textareaClass}
        />
      </Field>

      <div className="flex justify-end gap-3 sm:col-span-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-12 rounded-full border-2 border-ink bg-white px-6 font-bold"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 rounded-full border-2 border-ink bg-lemon px-7 font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black] disabled:translate-y-0 disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-5 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </form>
  )
}

/* ---------------------------------- Page ---------------------------------- */

export default function MyTuitions({
  initialTuitions,
}: {
  initialTuitions: Tuition[]
}) {
  const [items, setItems] = useState(initialTuitions)
  const [editTarget, setEditTarget] = useState<Tuition | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Tuition | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [statusTarget, setStatusTarget] = useState<{
    tuition: Tuition
    next: boolean
  } | null>(null)

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

  function replaceItem(t: Tuition) {
    setItems((prev) => prev.map((x) => (x._id === t._id ? t : x)))
  }

  async function toggleActive(t: Tuition, next: boolean) {
    setBusyId(t._id)
    replaceItem({ ...t, isActive: next })
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${t._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tuitions/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
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
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
            My tuitions
          </h1>
          <p className="mt-1 text-sm font-medium text-ink-soft sm:text-base">
            Edit, close or delete your posts.
          </p>
        </div>
        <Link
          href="/dashboard/tutor/post-tuition"
          className={cn(
            buttonVariants(),
            "h-12 rounded-full border-2 border-ink bg-lemon px-7 font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black]"
          )}
        >
          Post a tuition
        </Link>
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-ink bg-white p-10 text-center shadow-hard">
          <h2 className="font-heading text-2xl font-black">No tuitions yet</h2>
          <p className="mt-2 text-ink-soft">
            Post your first batch and it will show up here.
          </p>
        </div>
      ) : (
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
                    <MapPin
                      className="mt-0.5 size-4 shrink-0"
                      aria-hidden="true"
                    />
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
                          {t.subject} · {t.classLevel} · {t.daysPerWeek}{" "}
                          days/week
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
        </>
      )}

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

      {/* Delete confirmation */}
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
    </main>
  )
}
