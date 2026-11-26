export const subjects = [
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Programming",
  "IELTS",
  "Other",
]
export const classLevels = [
  "Class 6-8",
  "Class 9-10",
  "HSC",
  "HSC Admission",
  "University",
  "Adult",
]
export const modes = ["Online", "Offline"] as const

export type Tuition = {
  _id: string
  title: string
  subject: string
  classLevel: string
  mode: "Online" | "Offline"
  location: string
  monthlyFee: number
  daysPerWeek: number
  description: string
  bannerImage: string
  tutorId: string
  tutorName: string
  tutorEmail: string
  approvalStatus: "pending" | "approved" | "rejected"
  isActive: boolean
  createdAt: string
}
