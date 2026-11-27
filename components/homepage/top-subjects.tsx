import Link from "next/link"

type TopSubject = {
  subject: string
  tuitionCount: number
}

const subjectColors = ["bg-lilac", "bg-mint", "bg-sky-300", "bg-pink-300"]

const TopSubjects = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/top-subjects`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load subjects")
  }

  const subjects: TopSubject[] = await res.json()

  return (
    <section className="mx-auto my-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="mb-5 text-2xl font-black tracking-tight text-ink sm:text-3xl">
        Top subjects
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {subjects.map((item, index) => (
          <Link
            key={item.subject}
            href={`/tuitions?subject=${item.subject}`}
            className={`flex min-h-13 items-center justify-between gap-3 rounded-2xl border-2 border-ink px-4 py-3 font-black text-ink shadow-hard transition-all duration-200 hover:translate-x-1 hover:-translate-y-1 hover:shadow-hard-sm active:translate-x-0 active:translate-y-0 ${
              subjectColors[index % subjectColors.length]
            }`}
          >
            <span>{item.subject}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default TopSubjects
