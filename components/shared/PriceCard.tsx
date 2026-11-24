"use client"

const PriceCard = () => {
  const plans = [
    {
      role: "For Tutors",
      price: "$15",
      name: "Pro",
      description:
        "Unlimited tuition posts and a verified badge. Free plan: 2 posts, $0.",
      button: "Subscribe with Stripe",
      color: "bg-[#4038F5]",
      textColor: "text-white",
      buttonColor: "bg-[#FFDF35]",
    },
    {
      role: "For Students",
      price: "$10",
      name: "Pro",
      description:
        "Unlimited bookmarks and priority booking. Free plan: 5 bookmarks, $0.",
      button: "Subscribe with Stripe",
      color: "bg-[#FF5A43]",
      textColor: "text-black",
      buttonColor: "bg-white",
    },
  ]
  return (
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
      {plans.map((plan) => (
        <div
          key={plan.role}
          className={`${plan.color} ${plan.textColor} flex min-h-58.75 flex-col items-start rounded-2xl border-2 border-black p-6 shadow-[5px_5px_0_#111]`}
        >
          <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-[11px] font-bold text-black">
            {plan.role}
          </span>

          <h2 className="mt-4 text-[34px] leading-tight font-black">
            {plan.price} {plan.name}
          </h2>

          <p className="mt-3 max-w-105 text-sm leading-5.5">
            {plan.description}
          </p>

          <button
            className={`${plan.buttonColor} mt-4 cursor-pointer rounded-full border-2 border-black px-6 py-3 text-sm font-bold text-black shadow-[2px_3px_0_#111] transition-all hover:translate-y-px hover:shadow-none`}
            onClick={() => {
              // Connect Stripe checkout here
            }}
          >
            {plan.button}
          </button>
        </div>
      ))}
    </div>
  )
}

export default PriceCard
