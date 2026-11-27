import { cn } from "@/lib/utils"

export default function PageHeader({
  eyebrow,
  title,
  highlight,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  className?: string
}) {
  return (
    <header className={cn("flex flex-col items-start gap-4", className)}>
      {eyebrow && (
        <span className="rounded-full border-2 border-ink bg-lemon px-3 py-1 text-sm font-extrabold">
          {eyebrow}
        </span>
      )}
      <h1 className="font-heading text-4xl leading-[1.04] font-black tracking-tight sm:text-5xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="rounded-lg bg-lemon px-2">{highlight}</span>
          </>
        )}
      </h1>
      {description && (
        <p className="max-w-xl text-lg text-ink-soft">{description}</p>
      )}
    </header>
  )
}
