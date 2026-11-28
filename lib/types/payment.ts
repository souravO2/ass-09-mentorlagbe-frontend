export type Payment = {
  _id: string
  sessionId: string
  status: string
  payment_status: string
  customer_email: string
  customer_name: string
  customer_role: "student" | "tutor"
  planName: string
  amount: number
  currency: string
  userId: string
  payment_intent: string
  paymentDate: string // ISO string
}
