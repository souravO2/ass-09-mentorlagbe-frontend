import Link from "next/link"
import { CalendarDays, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tuition } from "@/lib/types/tuition"
import Image from "next/image"

export type TuitionCardData = Pick<
  Tuition,
  | "_id"
  | "title"
  | "subject"
  | "classLevel"
  | "mode"
  | "location"
  | "monthlyFee"
  | "daysPerWeek"
  | "bannerImage"
  | "tutorName"
>

const tagClass = "rounded-full border-2 border-ink font-bold text-ink"

export default function TuitionCard({
  tuition,
  className,
}: {
  tuition: TuitionCardData
  className?: string
}) {
  const t = tuition

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border-2 border-ink bg-white shadow-hard",
        className
      )}
    >
      <div className="aspect-video overflow-hidden border-b-2 border-ink bg-lilac/40">
        {t.bannerImage && (
          <Image
            src={t.bannerImage}
            alt={t.title}
            width={500}
            height={300}
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="size-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={cn(tagClass, "bg-lemon")}>
            {t.subject}
          </Badge>
          <Badge
            variant="outline"
            className={cn(tagClass, t.mode === "Online" ? "bg-mint" : "bg-sky")}
          >
            {t.mode}
          </Badge>
          <Badge variant="outline" className={cn(tagClass, "bg-white")}>
            {t.classLevel}
          </Badge>
        </div>

        <h3 className="line-clamp-2 font-heading text-xl leading-tight font-black">
          {t.title}
        </h3>
        <p className="text-sm font-medium text-ink">By {t.tutorName}</p>

        <ul className="flex flex-col gap-1.5 text-sm font-medium text-ink-soft">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
            {t.daysPerWeek} days per week
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" aria-hidden="true" />
            {t.mode === "Online" ? "Online" : t.location}
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <p>
            <span className="font-heading text-2xl font-black">
              ৳{t.monthlyFee.toLocaleString("en-US")}
            </span>
            <span className="text-sm font-medium text-ink-soft">/mo</span>
          </p>
          <Link
            href={`/tuitions/${t._id}`}
            className={cn(
              buttonVariants(),
              "h-10 rounded-full border-2 border-ink bg-blue px-5 font-bold text-white shadow-hard-sm"
            )}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}
