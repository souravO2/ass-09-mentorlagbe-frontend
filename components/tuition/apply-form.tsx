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
import { cn } from "@/lib/utils"
import { Tuition } from "@/lib/types/tuition"

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border-2 border-ink bg-white p-6 shadow-hard">
      {children}
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="text-sm font-bold text-[#B3261E]">
      {message}
    </p>
  )
}

export default function ApplyForm({ tuition }: { tuition: Tuition }) {
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const role = user?.role as string | undefined

  const initialForm = {
    phone: user?.phone || "",
    preferredSchedule: "",
    studentNote: "",
  }

  type FormState = typeof initialForm

  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [applied, setApplied] = useState(false)

  // Has this student already applied?
  useEffect(() => {
    if (!user || role !== "student") return
    let cancelled = false
    // TODO : have to send the userId through middleware and check if the user has already applied for this tuition
    // solved : used the userId from the session and tuitionId from the props to check if the user has already applied for this tuition by using query
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/applications?studentId=${user.id}&tuitionId=${tuition._id}`,
      { cache: "no-store" }
    )
      .then((res) => (res.ok ? res.json() : { applied: false }))
      .then((data) => !cancelled && setApplied(Boolean(data.applied)))
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [user, role, tuition._id])

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  function validateForm() {
    const next: typeof errors = {}

    const phone = form.phone.replace(/[\s-]/g, "")
    if (!/^(?:\+?88)?01[3-9]\d{8}$/.test(phone))
      next.phone = "Enter a valid Bangladeshi phone number"

    if (form.preferredSchedule.trim().length < 3)
      next.preferredSchedule = "Tell us when you are free, e.g. Sat and Mon 5pm"

    if (form.studentNote.length > 500)
      next.studentNote = "Keep the note under 500 characters"

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    if (!validateForm()) {
      toast.error("Please check the form fields")
      return
    }

    console.log("Submitting application:", form)

    setIsSubmitting(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/applications`,
        {
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
            studentPhone: form.phone.replace(/[\s-]/g, ""),
            preferredSchedule: form.preferredSchedule.trim(),
            studentNote: form.studentNote.trim(),
            status: "pending",
          }),
        }
      )

      if (res.status === 409) {
        setApplied(true)
        toast.error("You have already applied to this tuition")
        return
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? "Could not send your application")
      }

      setApplied(true)
      toast.success("Application sent")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // 1. Session still loading
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
        <Button
          type="button"
          disabled
          className="h-12 rounded-full border-2 border-ink bg-lemon font-extrabold text-ink opacity-60"
        >
          Apply Now
        </Button>
      </Panel>
    )
  }

  // 4. Already applied
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

  // 5. The form
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

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="phone"
          className="text-sm font-extrabold tracking-tight"
        >
          Phone
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="01XXXXXXXXX"
          className={inputClass}
        />
        <FieldError message={errors.phone} />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="preferredSchedule"
          className="text-sm font-extrabold tracking-tight"
        >
          Preferred schedule
        </Label>
        <Input
          id="preferredSchedule"
          name="preferredSchedule"
          value={form.preferredSchedule}
          onChange={handleChange}
          placeholder="e.g. Sat, Mon, Wed 5-6pm"
          className={inputClass}
        />
        <FieldError message={errors.preferredSchedule} />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="studentNote"
          className="text-sm font-extrabold tracking-tight"
        >
          Learning note{" "}
          <span className="font-medium text-ink-soft">(optional)</span>
        </Label>
        <Textarea
          id="studentNote"
          name="studentNote"
          value={form.studentNote}
          onChange={handleChange}
          rows={4}
          placeholder="What do you want to improve?"
          className={cn(textareaClass, "min-h-28")}
        />
        <FieldError message={errors.studentNote} />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 rounded-full border-2 border-ink bg-lemon text-base font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black] disabled:translate-y-0 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-5 animate-spin" />
            Sending…
          </>
        ) : (
          "Apply Now"
        )}
      </Button>
    </form>
  )
}
