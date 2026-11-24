type Step = {
  title: string;
  text: string;
  color: string;
};

const studentSteps: Step[] = [
  {
    title: "Sign up",
    text: "Pick Student or Tutor.",
    color: "bg-white",
  },
  {
    title: "Post or search",
    text: "Tutors list batches, students filter.",
    color: "bg-lilac",
  },
  {
    title: "Apply",
    text: "Students send an application.",
    color: "bg-mint",
  },
  {
    title: "Learn",
    text: "Tutors accept, sessions begin.",
    color: "bg-coral",
  },
];


function StepGrid({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid grid-cols-2 gap-7 sm:grid-cols-4 sm:gap-6">
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-col items-start">
          <span
            className={`mb-3 grid size-12 place-items-center rounded-full border-2 border-ink font-heading text-xl font-black shadow-[2px_2px_0_#111] ${step.color}`}
          >
            {i + 1}
          </span>

          <h3 className="font-heading text-lg font-black leading-tight">
            {step.title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-ink">
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function HomeHow() {
  return (
    <main>
      <section className="w-full border-y-2 border-ink bg-lemon">
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
          <h2 className="mb-8 font-heading text-4xl font-black tracking-tight">
            How it works
          </h2>

          <StepGrid steps={studentSteps} />
        </div>
      </section>
    </main>
  );
}

