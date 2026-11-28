"use client"

import {
  BadgeCheck,
  Bookmark,
  Check,
  GraduationCap,
  Infinity,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

const plans = [
  {
    role: "For Tutors",
    price: "$15",
    name: "Pro",
    description: "Grow your tutoring business with more opportunities.",
    freePlan: "Free plan includes 2 tuition posts",
    color: "bg-[#4038F5]",
    textColor: "text-white",
    buttonColor: "bg-[#FFDF35]",
    icon: GraduationCap,
    features: [
      "Unlimited tuition posts",
      "Verified tutor badge",
      "Reach more students",
    ],
  },
  {
    role: "For Students",
    price: "$10",
    name: "Pro",
    description: "Find and save more tutoring opportunities.",
    freePlan: "Free plan includes 5 bookmarks",
    color: "bg-[#FF5A43]",
    textColor: "text-black",
    buttonColor: "bg-white",
    icon: Bookmark,
    features: [
      "Unlimited bookmarks",
      "Priority booking",
      "Save more tuition opportunities",
    ],
  },
]

const PriceCard = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {plans.map((plan) => {
        const PlanIcon = plan.icon

        return (
          <div
            key={plan.role}
            className={`${plan.color} ${plan.textColor} flex flex-col rounded-3xl border-2 border-black p-6 shadow-[5px_5px_0_#111] sm:p-8`}
          >
            {/* Plan label */}
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border-2 border-black bg-white px-4 py-1.5 text-xs font-extrabold text-black">
                {plan.role}
              </span>

              <div className="grid size-12 place-items-center rounded-2xl border-2 border-black bg-white text-black">
                <PlanIcon className="size-6" />
              </div>
            </div>

            {/* Price */}
            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl leading-none font-black tracking-tight">
                  {plan.price}
                </h2>
                <span className="text-lg font-extrabold">/ Pro</span>
              </div>

              <p className="mt-3 max-w-sm text-sm leading-6 font-medium opacity-90">
                {plan.description}
              </p>
            </div>

            {/* Features */}
            <div className="mt-6 rounded-2xl border-2 border-black/20 bg-black/5 p-4">
              <p className="mb-4 flex items-center gap-2 text-sm font-extrabold">
                <Sparkles className="size-4" />
                What&apos;s included
              </p>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm font-semibold"
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-black bg-white text-black">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Free plan info */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-bold text-black">
              <BadgeCheck className="size-5 shrink-0" />
              <span>{plan.freePlan}</span>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              className={`${plan.buttonColor} mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-black px-6 py-4 text-sm font-extrabold text-black shadow-[3px_4px_0_#111] transition-all hover:translate-y-0.5 hover:shadow-[1px_2px_0_#111] active:translate-y-1 active:shadow-none`}
            >
              Subscribe with Stripe
              <Infinity className="size-5" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default PriceCard
