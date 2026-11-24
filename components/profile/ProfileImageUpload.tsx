"use client"

import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, ImagePlus, Trash2 } from "lucide-react"
import { toast } from "sonner"

type ProfileImageUploadProps = {
  imagePreview: string
  initials: string
  imageFile: File | null
  onImageChange: (file: File | null) => void
}

export function ProfileImageUpload({
  imagePreview,
  initials,
  imageFile,
  onImageChange,
}: ProfileImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (!file) return

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Choose a JPG, PNG or WEBP image")
      e.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB")
      e.target.value = ""
      return
    }

    onImageChange(file)
  }

  function handleDelete() {
    onImageChange(null)

    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="size-36 border-2 border-black">
          <AvatarImage
            src={imagePreview || undefined}
            alt="Profile picture"
            className="object-cover"
          />
          <AvatarFallback className="bg-[#CBB8FF] text-4xl font-black">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>

        {imagePreview && (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={handleDelete}
            className="absolute -top-2 -right-2 size-9 cursor-pointer rounded-full border-2 border-black hover:bg-coral"
            aria-label="Delete profile picture"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-full border-2 border-black font-bold shadow-[3px_3px_0_black] hover:translate-y-0.5 hover:shadow-none"
      >
        <Camera className="mr-2 size-4" />
        Choose Image
      </Button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-muted-foreground text-center text-xs">
        JPG, PNG or WEBP · Maximum 5MB
      </p>

      {imageFile && (
        <p className="text-muted-foreground flex max-w-full items-center gap-1 truncate text-xs font-medium">
          <ImagePlus className="size-3 shrink-0" />
          <span className="truncate">{imageFile.name}</span>
        </p>
      )}
    </div>
  )
}
