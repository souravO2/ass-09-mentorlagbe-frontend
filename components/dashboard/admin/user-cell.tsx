import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserCell({
  name,
  email,
  image,
}: {
  name: string
  email: string
  image?: string | null
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="size-10 shrink-0 border-2 border-ink">
        <AvatarImage src={image ?? undefined} alt="" />
        <AvatarFallback className="bg-lilac font-extrabold">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-bold">{name}</p>
        <p className="truncate text-sm text-ink-soft">{email}</p>
      </div>
    </div>
  )
}
