import { ArrowRight, Search } from "lucide-react"
import Image from "next/image"

const floatingCards = [
  {
    subject: "Biology",
    details: "Online · Class 9–10",
    className: "absolute right-48 top-5 rotate-[-6deg] bg-lemon",
  },
  {
    subject: "Chemistry",
    details: "Offline · HSC",
    className: "absolute right-2 top-0 rotate-[5deg] bg-lilac",
  },
]

export default function Hero() {
  return (
    <section className="overflow-hidden bg-[#F7F4FF]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2">
        {/* Left content */}
        <div className="relative z-10">
          <span className="inline-flex rounded-full border-2 border-ink bg-lemon px-3 py-1 text-xs font-bold text-ink shadow-hard-sm">
            Tuition and mentorship
          </span>

          <h1 className="mt-5 max-w-xl text-4xl leading-[1.05] font-black tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Find your ideal{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 -rotate-1 rounded-lg bg-lemon" />
              <span className="relative">tutor</span>
            </span>{" "}
            today
          </h1>

          <p className="mt-5 max-w-md text-sm leading-6 text-ink/70 sm:text-base">
            Search verified tutors by subject, class level, mode and monthly
            budget.
          </p>

          {/* Search bar */}
          <form
            action="/tuitions"
            className="mt-6 flex max-w-xl items-center gap-2 rounded-full border-2 border-ink bg-white p-2 shadow-hard"
          >
            <Search className="ml-3 size-5 shrink-0 text-ink/50" />

            <input
              type="search"
              name="search"
              placeholder="Try HSC Physics"
              className="min-w-0 flex-1 bg-transparent px-2 text-sm text-ink outline-none placeholder:text-ink/50 [&::-webkit-search-cancel-button]:scale-125"
            />

            <button
              type="submit"
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border-2 border-ink bg-lemon px-4 py-2.5 text-sm font-bold text-ink shadow-hard-sm transition-all hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-none active:translate-x-0 active:translate-y-0"
            >
              Browse Tuitions
              <ArrowRight className="size-4" />
            </button>
          </form>
        </div>

        {/* Right visual */}
        <div className="relative mx-auto h-90 w-full max-w-xl">
          {/* Floating subject cards — behind the teacher */}
          {floatingCards.map((card) => (
            <div
              key={card.subject}
              className={`${card.className} z-10 w-40 rounded-2xl border-2 border-ink p-4 shadow-hard sm:w-44`}
            >
              <p className="font-black text-ink">{card.subject}</p>
              <p className="mt-1 text-xs text-ink/80">{card.details}</p>
            </div>
          ))}

          {/* Green text card — at the back */}
          {/* <div className="absolute right-28 bottom-6 left-8 z-0 flex min-h-20 rotate-[-2deg] items-center rounded-2xl border-2 border-ink bg-mint p-4 shadow-hard">
            <p className="text-sm leading-5 font-black text-ink sm:text-base">
              Find the right tutor.
              <br />
              Learn with confidence.
            </p>
          </div> */}

          {/* Teacher photo — foreground */}
          <div className="absolute bottom-0 left-1/2 z-20 h-100 w-90 -translate-x-1/2 sm:h-120 sm:w-110">
            <Image
              src="/Learning.png"
              alt="Teacher helping a student"
              fill
              priority
              sizes="(max-width: 640px) 360px, 440px"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
