export type UserRole = "student" | "tutor" | "admin"

export type AppUser = {
  _id: string
  name: string
  email: string
  image?: string | null
  role: UserRole
  phone?: string
  plan: "free" | "pro"
  createdAt: string
}
