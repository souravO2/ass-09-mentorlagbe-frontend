"use client"

import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent, ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Loader2, MapPin, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { classLevels, modes, subjects } from "@/lib/types/tuition"

const FREE_LIMIT = 2

type TuitionMode = (typeof modes)[number]

type TuitionForm = {
  title: string
  subject: string
  classLevel: string
  mode: TuitionMode
  location: string
  monthlyFee: string
  daysPerWeek: string
  description: string
}

const initialForm: TuitionForm = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "Online",
  location: "",
  monthlyFee: "",
  daysPerWeek: "",
  description: "",
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

async function uploadToImgBB(file: File) {
  const body = new FormData()
  body.append("image", file)

  const res = await fetch("/api/upload", {
    method: "POST",
    body,
  })
  const json = await res.json()

  if (!res.ok || !json.success || !json.url) {
    throw new Error("Banner upload failed. Please try another image.")
  }

  return json.url as string
}

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

export default function PostTuitionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const plan = (session?.user.plan as string | undefined) ?? "free"

  const [form, setForm] = useState<TuitionForm>(initialForm)
  const [banner, setBanner] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [postCount, setPostCount] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<
    Partial<Record<keyof TuitionForm | "banner", string>>
  >({})

  useEffect(() => {
    let cancelled = false

    async function loadTuitionCount() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tuitions?tutorId=${session?.user.id}`
        )
        if (!res.ok) throw new Error("Could not load tuition count")
        const list = await res.json()
        if (!cancelled) setPostCount(Array.isArray(list) ? list.length : 0)
      } catch {
        if (!cancelled) setPostCount(0)
      }
    }

    loadTuitionCount()
    return () => {
      cancelled = true
    }
  })

  useEffect(() => {
    if (!preview) return
    return () => URL.revokeObjectURL(preview)
  }, [preview])

  const limitReached =
    plan !== "pro" && postCount !== null && postCount >= FREE_LIMIT

  function setField<K extends keyof TuitionForm>(
    key: K,
    value: TuitionForm[K]
  ) {
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

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller")
      event.target.value = ""
      return
    }

    setBanner(file)
    setPreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, banner: undefined }))
  }

  function removeBanner() {
    setBanner(null)
    setPreview(null)
    const input = document.getElementById("banner") as HTMLInputElement | null
    if (input) input.value = ""
  }

  function validateForm() {
    const nextErrors: typeof errors = {}

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
    if (!form.daysPerWeek || !Number.isInteger(days) || days < 1 || days > 7) {
      nextErrors.daysPerWeek = "Enter a number between 1 and 7"
    }

    if (form.description.trim().length < 30)
      nextErrors.description = "Description must be at least 30 characters"
    if (!banner) nextErrors.banner = "Banner image is required"

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    if (limitReached) {
      toast.error("You have reached your free tuition post limit")
      return
    }

    if (!validateForm()) {
      toast.error("Please check the form fields")
      return
    }
    if (!banner) return

    setIsSubmitting(true)
    try {
      const bannerImage = await uploadToImgBB(banner)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          description: form.description.trim(),
          bannerImage,
          tutorId: session?.user.id,
          tutorName: session?.user.name,
          tutorEmail: session?.user.email,
          approvalStatus: "pending",
          isActive: true,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message ?? "Could not post the tuition")
      }

      toast.success("Submitted for admin approval")
      router.push("/dashboard/tutor/my-tuitions")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 pb-10">
      <Link
        href="/dashboard/tutor/my-tuitions"
        className="inline-flex w-fit items-center gap-2 text-sm font-bold text-ink/65 transition hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to my tuitions
      </Link>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-heading text-3xl font-black tracking-tight sm:text-4xl">
            Post a tuition
          </h1>
          <p
            className={cn(
              "mt-1 text-sm font-medium sm:text-base",
              limitReached ? "font-bold text-coral" : "text-ink-soft"
            )}
          >
            {plan === "pro"
              ? "Pro plan: Unlimited posts"
              : limitReached
                ? `Free plan: ${FREE_LIMIT} of ${FREE_LIMIT} posts used — upgrade to publish another tuition`
                : `Free plan: ${postCount ?? "…"} of ${FREE_LIMIT} posts used`}
          </p>
        </div>

        {plan !== "pro" && (
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 shrink-0 rounded-xl border-2 border-ink bg-lemon px-5 font-extrabold shadow-hard hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_black]"
            )}
          >
            Upgrade to Pro
          </Link>
        )}
      </header>

      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-7 rounded-3xl border-2 border-ink bg-white p-6 shadow-hard sm:p-8"
      >
        <div className="grid w-full min-w-0 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Field id="title" label="Title" error={errors.title}>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleTextChange}
              placeholder="e.g. SSC Mathematics — Concept & Practice"
              className={inputClass}
              minLength={5}
              required
            />
          </Field>

          <Field id="subject" label="Subject" error={errors.subject}>
            <Select
              value={form.subject}
              onValueChange={(value) => {
                if (value) setField("subject", value)
              }}
            >
              <SelectTrigger id="subject" className={selectTriggerClass}>
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

          <Field id="classLevel" label="Class level" error={errors.classLevel}>
            <Select
              value={form.classLevel}
              onValueChange={(value) => {
                if (value) setField("classLevel", value)
              }}
            >
              <SelectTrigger id="classLevel" className={selectTriggerClass}>
                <SelectValue placeholder="Choose class or level" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {classLevels.map((level) => (
                  <SelectItem
                    key={level}
                    value={level}
                    className={selectItemClass}
                  >
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="mode" label="Mode">
            <Select
              value={form.mode}
              onValueChange={(value) => {
                if (value) handleModeChange(value)
              }}
            >
              <SelectTrigger id="mode" className={selectTriggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                {modes.map((mode) => (
                  <SelectItem
                    key={mode}
                    value={mode}
                    className={selectItemClass}
                  >
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="monthlyFee" label="Monthly fee" error={errors.monthlyFee}>
            <Input
              id="monthlyFee"
              name="monthlyFee"
              type="number"
              inputMode="numeric"
              min={100}
              value={form.monthlyFee}
              onChange={handleTextChange}
              placeholder="e.g. 5000"
              className={inputClass}
              required
            />
          </Field>

          <Field
            id="daysPerWeek"
            label="Days per week"
            error={errors.daysPerWeek}
          >
            <Input
              id="daysPerWeek"
              name="daysPerWeek"
              type="number"
              inputMode="numeric"
              min={1}
              max={7}
              value={form.daysPerWeek}
              onChange={handleTextChange}
              placeholder="e.g. 4"
              className={inputClass}
              required
            />
          </Field>

          {form.mode === "Offline" && (
            <Field
              id="location"
              label="Location"
              error={errors.location}
              className="md:col-span-2 lg:col-span-3"
            >
              <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/45" />
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleTextChange}
                  placeholder="Area, city"
                  className={cn(inputClass, "pl-11")}
                  required
                />
              </div>
            </Field>
          )}

          <Field
            id="description"
            label="Description"
            error={errors.description}
            className="md:col-span-2 lg:col-span-3"
          >
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleTextChange}
              rows={6}
              placeholder="Describe the syllabus, batch size, teaching approach, schedule, and what students can expect…"
              className={textareaClass}
              minLength={30}
              required
            />
          </Field>

          <div className="flex w-full min-w-0 flex-col gap-2 md:col-span-2 lg:col-span-3">
            <div className="relative w-full">
              <label
                htmlFor="banner"
                className={cn(
                  "flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 border-dashed border-ink bg-paper px-5 text-center transition hover:bg-lilac/30",
                  preview && "p-2"
                )}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Tuition cover preview"
                    className="max-h-72 w-full rounded-xl object-cover"
                  />
                ) : (
                  <>
                    <span className="font-extrabold">Upload banner image</span>
                    <span className="text-sm font-medium text-ink-soft">
                      PNG or JPG, uploaded via ImgBB
                    </span>
                  </>
                )}
              </label>
              <Input
                id="banner"
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="sr-only"
              />
              {preview && (
                <button
                  type="button"
                  onClick={removeBanner}
                  aria-label="Remove cover image"
                  className="absolute top-4 right-4 grid size-10 place-items-center rounded-full border-2 border-ink bg-white shadow-hard-sm transition hover:-translate-y-0.5"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            {errors.banner && (
              <p role="alert" className="text-sm font-bold text-[#B3261E]">
                {errors.banner}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col items-start">
          <Button
            type="submit"
            disabled={isSubmitting || limitReached}
            className={`${limitReached ? "bg-coral" : "bg-lemon"} ml-auto h-12 rounded-full border-2 border-ink px-8 text-base font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black] disabled:translate-y-0 disabled:opacity-60`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Uploading & submitting…
              </>
            ) : limitReached ? (
              "Limit reached"
            ) : (
              "Submit for approval"
            )}
          </Button>
        </div>
      </form>
    </main>
  )
}
