export type ApplicationStatus = "pending" | "accepted" | "rejected"

export type Application = {
  _id: string
  tutorId: string
  tutorName: string
  tutorEmail: string
  tuitionId: string
  tuitionTitle: string
  subject: string
  monthlyFee: number
  studentName: string
  studentEmail: string
  studentPhone: string
  preferredSchedule: string
  studentNote: string
  status: ApplicationStatus
  appliedAt: string
  studentId: string
}
