export type PlanRole = "student" | "tutor"

export const plans: Record<
  PlanRole,
  { name: string; price: number; perks: string[] }
> = {
  student: {
    name: "Student Pro",
    price: 10,
    perks: ["Unlimited saved tuitions", "Priority booking"],
  },
  tutor: {
    name: "Tutor Pro",
    price: 15,
    perks: ["Unlimited tuition posts", "Verified badge on your profile"],
  },
}
