
import {
  Code2,
  Database,
  ShieldCheck,
  CreditCard,
  ImageIcon,
  Search,
  LayoutDashboard,
  Workflow,
} from "lucide-react"

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Express.js",
  "MongoDB",
  "Better Auth",
  "Stripe",
  "ImgBB",
]

const highlights = [
  {
    icon: LayoutDashboard,
    number: "01",
    title: "Role-based dashboards",
    description:
      "Separate dashboards for Students, Tutors, and Admins with role-specific features and access.",
    color: "bg-lilac",
  },
  {
    icon: Database,
    number: "02",
    title: "Full-stack data management",
    description:
      "Designed connected MongoDB collections for users, tuitions, applications, and payments.",
    color: "bg-mint",
  },
  {
    icon: Search,
    number: "03",
    title: "Search & tuition discovery",
    description:
      "Built tuition browsing with search and filters for subjects, class levels, and learning modes.",
    color: "bg-lemon",
  },
  {
    icon: CreditCard,
    number: "04",
    title: "Stripe subscriptions",
    description:
      "Integrated Pro plan checkout and payment verification with subscription and transaction records.",
    color: "bg-[#FFD9CF]",
  },
  {
    icon: ImageIcon,
    number: "05",
    title: "Image upload system",
    description:
      "Implemented image uploads for tutor tuition banners and user profile pictures using ImgBB.",
    color: "bg-[#DCEBFF]",
  },
  {
    icon: ShieldCheck,
    number: "06",
    title: "Authentication & access",
    description:
      "Implemented Better Auth with session-based authentication using the MDB session token approach.",
    color: "bg-[#E8E8E8]",
  },
]

export default function ProjectBehindSection() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-lemon px-4 py-2 text-sm font-bold shadow-[3px_3px_0_0_#18181b]">
              <Code2 className="size-4" />
              Behind the project
            </span>

            <h2 className="max-w-xl text-4xl font-black tracking-tight text-ink sm:text-5xl">
              More than just a tuition finder.
            </h2>
          </div>

          <p className="max-w-xl text-base leading-7 text-ink/70 md:justify-self-end">
            MentorLagbe is a full-stack EdTech platform I built to connect
            students with tutors while exploring real-world authentication,
            database design, payment integration, and application workflows.
          </p>
        </div>

        {/* Technology stack */}
        <div className="mb-8 rounded-3xl border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_0_#18181b] sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Workflow className="size-6" />
            <h3 className="text-xl font-black">Technology stack</h3>
          </div>

          <div className="flex flex-wrap gap-3">
            {technologies.map((technology) => (
              <span
                key={technology}
                className="rounded-xl border-2 border-ink bg-white px-4 py-2 text-sm font-bold text-ink transition-transform hover:-translate-y-1"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>

        {/* Project highlights */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon

            return (
              <article
                key={item.number}
                className={`group rounded-3xl border-2 border-ink ${item.color} p-6 shadow-[5px_5px_0_0_#18181b] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0_0_#18181b]`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl border-2 border-ink bg-white">
                    <Icon className="size-6 text-ink" />
                  </div>

                  <span className="font-mono text-sm font-bold text-ink/50">
                    {item.number}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-black text-ink">
                  {item.title}
                </h3>

                <p className="text-sm leading-6 text-ink/70">
                  {item.description}
                </p>
              </article>
            )
          })}
        </div>

        {/* Closing statement */}
        <div className="mt-10 flex flex-col gap-4 rounded-3xl border-2 border-ink bg-ink p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="mb-2 text-sm font-semibold text-white/60">
              What I learned
            </p>
            <h3 className="text-2xl font-black">
              Building a real product, one feature at a time.
            </h3>
          </div>

          <p className="max-w-md text-sm leading-6 text-white/70">
            From designing the database to connecting frontend forms with
            backend APIs, MentorLagbe helped me practice building a complete
            web application.
          </p>
        </div>
      </div>
    </section>
  )
}
