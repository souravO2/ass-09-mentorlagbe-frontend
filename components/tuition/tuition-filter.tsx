"use client"

import { useState, useTransition } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, Loader2, Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  inputClass,
  selectContentClass,
  selectItemClass,
  selectTriggerClass,
} from "@/lib/styles/form-styles"
import { TuitionQuery } from "@/lib/styles/tuition-query"
import { classLevels, modes, subjects } from "@/lib/types/tuition"
import { cn } from "@/lib/utils"

const ALL = "all"

export function FilterSelect({
  id,
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: readonly string[]
  allLabel: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm font-extrabold tracking-tight">
        {label}
      </Label>
      <Select value={value} onValueChange={(v) => v && onChange(v)}>
        <SelectTrigger id={id} className={selectTriggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className={selectContentClass}>
          <SelectItem value={ALL} className={selectItemClass}>
            {allLabel}
          </SelectItem>
          {options.map((option) => (
            <SelectItem key={option} value={option} className={selectItemClass}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

type Defaults = Pick<TuitionQuery, "search" | "subject" | "classLevel" | "mode">

export default function TuitionFilters({ defaults }: { defaults: Defaults }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false) // only matters on mobile

  const [form, setForm] = useState({
    search: defaults.search,
    subject: defaults.subject || ALL,
    classLevel: defaults.classLevel || ALL,
    mode: defaults.mode || ALL,
  })

  const activeCount = [
    defaults.search,
    defaults.subject,
    defaults.classLevel,
    defaults.mode,
  ].filter(Boolean).length

  function setField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setField("search", event.target.value)
  }

  function go(qs: string) {
    setOpen(false) // collapse the panel after applying or resetting
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const sp = new URLSearchParams()
    const search = form.search.trim()
    if (search) sp.set("search", search)
    if (form.subject !== ALL) sp.set("subject", form.subject)
    if (form.classLevel !== ALL) sp.set("classLevel", form.classLevel)
    if (form.mode !== ALL) sp.set("mode", form.mode)
    go(sp.toString())
  }

  function handleReset() {
    setForm({ search: "", subject: ALL, classLevel: ALL, mode: ALL })
    go("")
  }

  return (
    <div className="rounded-3xl border-2 border-ink bg-white shadow-hard">
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="filter-panel"
        className="flex w-full items-center justify-between gap-3 p-5 font-heading text-lg font-black lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="size-5" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="grid size-6 place-items-center rounded-full border-2 border-ink bg-lemon text-xs font-extrabold">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDown
          className={cn("size-5 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      <form
        id="filter-panel"
        onSubmit={handleSubmit}
        className={cn(
          "flex-col gap-5 border-t-2 border-ink p-6 lg:flex lg:border-t-0",
          open ? "flex" : "hidden"
        )}
      >
        <div className="flex flex-col gap-2">
          <Label
            htmlFor="search"
            className="text-sm font-extrabold tracking-tight"
          >
            Search
          </Label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink/45"
              aria-hidden="true"
            />
            <Input
              id="search"
              name="search"
              value={form.search}
              onChange={handleSearchChange}
              placeholder="Title or subject"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>

        <FilterSelect
          id="subject"
          label="Subject"
          value={form.subject}
          options={subjects}
          allLabel="All subjects"
          onChange={(v) => setField("subject", v)}
        />
        <FilterSelect
          id="classLevel"
          label="Class level"
          value={form.classLevel}
          options={classLevels}
          allLabel="All levels"
          onChange={(v) => setField("classLevel", v)}
        />
        <FilterSelect
          id="mode"
          label="Mode"
          value={form.mode}
          options={modes}
          allLabel="Online and offline"
          onChange={(v) => setField("mode", v)}
        />

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isPending}
            className="h-12 flex-1 rounded-full border-2 border-ink bg-lemon font-extrabold text-ink shadow-hard transition hover:-translate-y-0.5 hover:shadow-[5px_5px_0_black]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                Searching…
              </>
            ) : (
              "Apply filters"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="h-12 rounded-full border-2 border-ink bg-white px-5 font-bold"
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  )
}
