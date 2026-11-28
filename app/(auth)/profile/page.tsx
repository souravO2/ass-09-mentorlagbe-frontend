"use client"

import { useEffect, useState } from "react"
import { useSession, authClient, signOut } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProfileImageUpload } from "@/components/profile/ProfileImageUpload"
import { ProfileField } from "@/components/profile/ProfileField"
import { ProfileConfirmDialog } from "@/components/profile/ConfirmDialog"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type UserRole = "student" | "tutor"
type UserPlan = "free" | "pro"

type ProfileUser = {
  id: string
  name: string
  email: string
  image?: string | null
  phone?: string | null
  bio?: string | null
  role?: string | null
  plan?: string | null
}

export default function ProfilePage() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F7F4FF]">
        Loading profile...
      </div>
    )
  }

  if (!session?.user) {
    return redirect("/sign-in")
  }

  return <ProfileForm key={session.user.id} user={session.user} />
}

function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()

  async function handleSignOut() {
    try {
      await signOut()

      toast.success("Signed out")
      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Could not sign out. Try again.")
    }
  }

  const [name, setName] = useState(user.name || "")
  const [phone, setPhone] = useState(user.phone || "")
  const [bio, setBio] = useState(user.bio || "")

  const [role, setRole] = useState<UserRole>(
    user.role === "tutor" ? "tutor" : "student"
  )

  const plan: UserPlan = user.plan === "pro" ? "pro" : "free"

  const [imagePreview, setImagePreview] = useState(user.image ?? "")
  const [imageUrl, setImageUrl] = useState<string | null>(user.image ?? null)

  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Revoke temporary object URLs
  useEffect(() => {
    if (!imagePreview?.startsWith("blob:")) return

    return () => URL.revokeObjectURL(imagePreview)
  }, [imagePreview])

  // Upload selected image immediately
  async function handleImageChange(file: File | null) {
    if (!file) {
      setImagePreview("")
      setImageUrl(null)
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB")
      return
    }

    const previewUrl = URL.createObjectURL(file)

    setImagePreview(previewUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success || !result.url) {
        throw new Error(result.error || "Image upload failed")
      }

      setImageUrl(result.url)
      setImagePreview(result.url)

      toast.success("Image uploaded successfully!")
    } catch (error) {
      setImagePreview(user.image ?? "")
      setImageUrl(user.image ?? null)

      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      )
    } finally {
      setIsUploading(false)
    }
  }

  // Update MongoDB through Better Auth
  async function handleUpdate() {
    if (!name.trim()) {
      toast.error("Full name cannot be empty")
      return
    }

    if (isSaving || isUploading) return

    setIsSaving(true)

    try {
      console.log("Updating profile:", {
        name: name.trim(),
        image: imageUrl,
        phone: phone.trim(),
        bio: bio.trim(),
        role,
      })

      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl,
        phone: phone.trim(),
        bio: bio.trim(),

        // Only student/tutor can update their account type here.
        ...(user.role !== "admin" && { role }),
      })

      if (error) {
        throw new Error(error.message || "Profile update failed")
      }

      toast.success("Profile updated successfully!")
      setShowConfirm(false)

      // Refresh the session so the latest user data is available
      await authClient.getSession()
      router.refresh()
    } catch (error) {
      console.error("Profile update error:", error)

      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-[#F7F4FF] text-black">
      <main className="p-5 md:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-gray-500">YOUR ACCOUNT</p>

            <h1 className="text-3xl font-black md:text-4xl">Update Profile</h1>

            <p className="text-gray-600">Edit your personal information</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border-2 border-black bg-[#FFDA3F] px-4 py-2 text-sm font-bold capitalize">
              {user.role || "Student"}
            </span>
            {user.role !== "admin" && (
              <span
                className={cn(
                  "rounded-full border-2 border-black px-4 py-2 text-sm font-bold capitalize",
                  plan === "pro" ? "bg-[#CBB8FF]" : "bg-gray-100"
                )}
              >
                {plan} Plan
              </span>
            )}
            <Button
              type="button"
              variant="outline"
              disabled={isUploading || isSaving}
              onClick={handleSignOut}
              className="cursor-pointer rounded-full border-2 border-ink bg-coral px-4 py-4 font-extrabold text-ink shadow-[3px_3px_0_black] transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-[4px_4px_0_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:translate-y-0 disabled:opacity-50"
            >
              Sign Out
            </Button>
          </div>
        </header>

        <section className="rounded-3xl border-2 border-black bg-white p-6 shadow-[5px_5px_0_black] md:p-10">
          <div className="grid gap-10 md:grid-cols-[180px_1fr]">
            <ProfileImageUpload
              imagePreview={imagePreview}
              imageFile={null}
              initials={initials}
              onImageChange={handleImageChange}
            />

            <div className="space-y-5">
              <ProfileField
                id="name"
                label="Full name"
                value={name}
                onChange={setName}
                placeholder="Enter your full name"
              />

              <ProfileField
                id="email"
                label="Email"
                value={user.email}
                readOnly
              />

              <ProfileField
                id="phone"
                label="Phone"
                value={phone}
                onChange={setPhone}
                placeholder="Enter your phone number"
              />

              <ProfileField
                id="bio"
                label="Bio"
                value={bio}
                onChange={setBio}
                placeholder="Tell us something about yourself..."
                multiline
              />
              {user.role !== "admin" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold">Account type</label>

                  <Select
                    value={role}
                    onValueChange={(value) => setRole(value as UserRole)}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-2 border-black bg-white font-semibold shadow-[3px_3px_0_black] focus:ring-[#CBB8FF]">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>

                    <SelectContent className="rounded-xl border-2 border-black bg-white p-1 shadow-[4px_4px_0_black]">
                      <SelectItem
                        value="student"
                        className="cursor-pointer rounded-lg font-semibold focus:bg-[#CBB8FF] focus:text-black data-[state=checked]:bg-[#FFDA3F]"
                      >
                        Student
                      </SelectItem>
                      <SelectItem
                        value="tutor"
                        className="cursor-pointer rounded-lg font-semibold focus:bg-[#CBB8FF] focus:text-black data-[state=checked]:bg-[#FFDA3F]"
                      >
                        Tutor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="button"
                  disabled={isUploading || isSaving}
                  onClick={() => setShowConfirm(true)}
                  className="h-12 cursor-pointer rounded-full border-2 border-black bg-[#FFDA3F] px-7 font-bold text-black shadow-[3px_3px_0_black] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#FFDA3F] hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUploading
                    ? "Uploading image..."
                    : isSaving
                      ? "Saving..."
                      : "Update Profile"}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ProfileConfirmDialog
        open={showConfirm}
        isSaving={isSaving || isUploading}
        onOpenChange={setShowConfirm}
        onConfirm={handleUpdate}
      />
    </div>
  )
}
