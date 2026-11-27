"use client"

import { ChangeEvent, FormEvent, ReactNode, useState } from "react"
import { Loader2, MapPin } from "lucide-react"
import { classLevels, subjects, Tuition, modes } from "@/lib/types/tuition"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

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

export default function EditForm({
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
