"use client"

import { Card, CardContent } from "@/components/ui/card"

export default function HomePro() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 md:py-14">
      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {/* Tutor Pro */}
        <Card className="rounded-xl border-2 border-black bg-[#4038F5] shadow-[3px_3px_0px_#111]">
          <CardContent className="flex flex-col items-start gap-3 p-5">
            <h2 className="text-4xl font-extrabold text-white">Tutor Pro</h2>

            <p className="text-lg font-medium text-white">
              Unlimited posts and a verified badge. $15
            </p>

            <button
              className={`mt-4 cursor-pointer rounded-full border-2 border-black bg-lemon px-6 py-3 text-sm font-bold text-black shadow-[2px_3px_0_#111] transition-all hover:translate-y-px hover:shadow-none`}
              onClick={() => {
                // Connect Stripe checkout here
              }}
            >
              Subscribe with Stripe
            </button>
          </CardContent>
        </Card>

        {/* Student Pro */}
        <Card className="rounded-xl border-2 border-black bg-[#FF5945] shadow-[3px_3px_0px_#111]">
          <CardContent className="flex flex-col items-start gap-3 p-5">
            <h2 className="text-4xl font-extrabold text-black">Student Pro</h2>

            <p className="text-lg font-medium text-black">
              Unlimited bookmarks and priority booking. $10
            </p>

            <button
              className={`mt-4 cursor-pointer rounded-full border-2 border-black bg-paper px-6 py-3 text-sm font-bold text-black shadow-[2px_3px_0_#111] transition-all hover:translate-y-1px hover:shadow-none`}
              onClick={() => {
                // Connect Stripe checkout here
              }}
            >
              Subscribe with Stripe
            </button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
