"use client"

import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent, ReactNode } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { CheckCircle2, Loader2, Lock } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { authClient } from "@/lib/auth-client"
import { inputClass, textareaClass } from "@/lib/styles/form-styles"
import type { Tuition } from "@/lib/types/tuition"
import { cn } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const FREE_APPLY_LIMIT = 5
const PHONE_PATTERN = /^(?:\+?88)?01[3-9]\d{8}$/
const NOTE_MAX_LENGTH = 500

const emptyForm = {
  phone: "",
  preferredSchedule: "",
  studentNote: "",
}

type FormState = typeof emptyForm
type FormErrors = Partial<Record<keyof FormState, string>>
type LimitStatus = "loading" | "ready" | "error"
type ApplicationStatusResponse = { applied: boolean; count: number }

const normalizePhone = (value: string) => value.replace(/[\s-]/g, "")

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-white p-6 shadow-hard">
      {children}
    </div>
  )
}

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string
  label: string
  optional?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-extrabold tracking-tight">
        {label}
        {optional && (
          <span className="ml-1 font-medium text-ink-soft">(optional)</span>
        )}
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

function LimitNote({
  status,
  count,
  onRetry,
}: {
  status: LimitStatus
  count: number
  onRetry: () => void
}) {
  if (status === "loading") {
    return (
      <p aria-live="polite" className="text-sm font-bold text-ink-soft">
        Checking your application limit…
      </p>
    )
  }

  if (status === "error") {
    return (
      <p
        role="alert"
        className="flex flex-wrap items-center gap-x-2 text-sm font-bold text-[#B3261E]"
      >
        Could not check your application limit.
        <button type="button" onClick={onRetry} className="text-ink underline">
          Try again
        </button>
      </p>
    )
  }

  if (count >= FREE_APPLY_LIMIT) {
    return (
      <p className="flex flex-col items-center text-sm font-bold text-[#B3261E]">
        You have used all {FREE_APPLY_LIMIT} free applications.{" "}
        <span>
          <Link href="/checkout" className="text-lg text-ink underline">
            Upgrade to Pro
          </Link>{" "}
          to apply to more.
        </span>
      </p>
    )
  }

  return (
    <p className="text-sm font-bold text-ink-soft">
      Free plan: {count} of {FREE_APPLY_LIMIT} applications used
    </p>
  )
}

export default function ApplyForm({ tuition }: { tuition: Tuition }) {
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user
  const role = user?.role as string | undefined
  const isPro = user?.plan === "pro"
  const studentId = role === "student" ? user?.id : undefined

  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [applied, setApplied] = useState(false)
  const [applicationCount, setApplicationCount] = useState(0)
  const [limitStatus, setLimitStatus] = useState<LimitStatus>("loading")
  const [retryKey, setRetryKey] = useState(0)

  const limitReached =
    !isPro && limitStatus === "ready" && applicationCount >= FREE_APPLY_LIMIT

  // Free students must have a confirmed count before they can apply
  const limitUnconfirmed = !isPro && limitStatus !== "ready"

  const cannotApply = isSubmitting || limitUnconfirmed || limitReached

  // Has this student applied here already, and how many applications do they have?
  useEffect(() => {
    if (!studentId) return

    const controller = new AbortController()

    const loadStatus = async () => {
      try {
        const params = new URLSearchParams({
          studentId,
          tuitionId: tuition._id,
        })

        const res = await fetch(`${API_URL}/applications?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        })
        if (!res.ok) throw new Error("Could not load application status")

        const data: ApplicationStatusResponse = await res.json()
        if (!Number.isInteger(data.count) || data.count < 0) {
          throw new Error("Invalid application count")
        }

        setApplied(Boolean(data.applied))
        setApplicationCount(data.count)
        setLimitStatus("ready")
      } catch {
        if (!controller.signal.aborted) setLimitStatus("error")
      }
    }

    loadStatus()
    return () => controller.abort()
  }, [studentId, tuition._id, retryKey])

  function retryLimitCheck() {
    setLimitStatus("loading")
    setRetryKey((key) => key + 1)
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function validateForm() {
    const next: FormErrors = {}

    if (!PHONE_PATTERN.test(normalizePhone(form.phone))) {
      next.phone = "Enter a valid Bangladeshi phone number"
    }
    if (form.preferredSchedule.trim().length < 3) {
      next.preferredSchedule = "Tell us when you are free, e.g. Sat and Mon 5pm"
    }
    if (form.studentNote.length > NOTE_MAX_LENGTH) {
      next.studentNote = `Keep the note under ${NOTE_MAX_LENGTH} characters`
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (cannotApply) return

    if (!validateForm()) {
      toast.error("Please check the form fields")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tuitionId: tuition._id,
          tutorId: tuition.tutorId,
          tuitionTitle: tuition.title,
          tutorName: tuition.tutorName,
          tutorEmail: tuition.tutorEmail,
          subject: tuition.subject,
          monthlyFee: tuition.monthlyFee,
          studentId: user?.id,
          studentName: user?.name,
          studentEmail: user?.email,
          studentPhone: normalizePhone(form.phone),
          preferredSchedule: form.preferredSchedule.trim(),
          studentNote: form.studentNote.trim(),
          status: "pending",
        }),
      })

      if (res.status === 409) {
        setApplied(true)
        toast.error("You have already applied to this tuition")
        return
      }

      if (res.status === 403) {
        setApplicationCount(FREE_APPLY_LIMIT)
        setLimitStatus("ready")
        toast.error("You have reached the free plan limit")
        return
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? "Could not send your application")
      }

      setApplied(true)
      setApplicationCount((count) => count + 1)
      toast.success("Application sent")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1. Session loading
  if (isPending) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="h-72 animate-pulse rounded-3xl border-2 border-ink bg-lilac/40"
      />
    )
  }

  // 2. Signed out
  if (!user) {
    return (
      <Panel>
        <span className="grid size-12 place-items-center rounded-full border-2 border-ink bg-lemon">
          <Lock className="size-5" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-2xl font-black">Sign in to apply</h2>
        <p className="text-ink-soft">
          Create a student account or sign in to send your application.
        </p>
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants(),
            "h-12 rounded-full border-2 border-ink bg-lemon font-extrabold text-ink shadow-hard-sm"
          )}
        >
          Sign In
        </Link>
      </Panel>
    )
  }

  // 3. Tutor or admin
  if (role !== "student") {
    return (
      <Panel>
        <h2 className="font-heading text-2xl font-black">Students only</h2>
        <p className="text-ink-soft">
          Only student accounts can apply for a tuition. You are signed in as{" "}
          {role === "admin" ? "an admin" : "a tutor"}.
        </p>
      </Panel>
    )
  }

  // 4. Already applied to this tuition
  if (applied) {
    return (
      <Panel>
        <span className="grid size-12 place-items-center rounded-full border-2 border-ink bg-mint">
          <CheckCircle2 className="size-6" aria-hidden="true" />
        </span>
        <h2 className="font-heading text-2xl font-black">You have applied</h2>
        <p className="text-ink-soft">
          The tutor will review your request. Track the status from your
          dashboard.
        </p>
        <Link
          href="/dashboard/student/my-applications"
          className={cn(
            buttonVariants(),
            "h-12 rounded-full border-2 border-ink bg-blue font-bold text-white shadow-hard-sm"
          )}
        >
          My Applications
        </Link>
      </Panel>
    )
  }

  // 5. Application form
  let buttonLabel = "Apply Now"
  if (!isPro && limitStatus === "loading") buttonLabel = "Checking limit…"
  else if (!isPro && limitStatus === "error")
    buttonLabel = "Could not check limit"
  else if (limitReached) buttonLabel = "Limit reached"

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl border-2 border-ink bg-white p-6 shadow-hard"
    >
      <h2 className="font-heading text-2xl font-black">
        Apply for this tuition
      </h2>

      <div className="rounded-xl border-2 border-ink bg-paper p-3 text-sm">
        <p className="font-bold">{user.name}</p>
        <p className="text-ink-soft">{user.email}</p>
      </div>

      <Field id="phone" label="Phone" error={errors.phone}>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone || (user?.phone as string) || ""}
          onChange={handleChange}
          placeholder="01XXXXXXXXX"
          className={inputClass}
        />
      </Field>

      <Field
        id="preferredSchedule"
        label="Preferred schedule"
        error={errors.preferredSchedule}
      >
        <Input
          id="preferredSchedule"
          name="preferredSchedule"
          value={form.preferredSchedule}
          onChange={handleChange}
          placeholder="e.g. Sat, Mon, Wed 5-6pm"
          className={inputClass}
        />
      </Field>

      <Field
        id="studentNote"
        label="Learning note"
        optional
        error={errors.studentNote}
      >
        <Textarea
          id="studentNote"
          name="studentNote"
          value={form.studentNote}
          onChange={handleChange}
          rows={4}
          placeholder="What do you want to improve?"
          className={cn(textareaClass, "min-h-28")}
        />
      </Field>

      {!isPro && (
        <LimitNote
          status={limitStatus}
          count={applicationCount}
          onRetry={retryLimitCheck}
        />
      )}

      <Button
        type="submit"
        disabled={cannotApply}
        className="h-12 rounded-full border-2 border-ink bg-lemon text-base font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black] disabled:translate-y-0 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Sending…
          </>
        ) : (
          buttonLabel
        )}
      </Button>
    </form>
  )
}
