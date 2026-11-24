import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How It Works | MentorLagbe",
  description: "See how students find tutors and how tutors post and manage tuition batches on MentorLagbe.",
};

type Step = { title: string; text: string; color: string };

const studentSteps: Step[] = [
  { title: "Sign up", text: "Create a free Student account in under a minute.", color: "bg-lemon" },
  { title: "Search", text: "Filter approved tuitions by subject, class level and mode.", color: "bg-lilac" },
  { title: "Apply", text: "Send your phone, preferred schedule and a short learning note.", color: "bg-mint" },
  { title: "Track", text: "Follow your application status from your dashboard.", color: "bg-sky" },
];

const tutorSteps: Step[] = [
  { title: "Sign up", text: "Create a Tutor account and complete your profile.", color: "bg-lemon" },
  { title: "Post", text: "List a batch or a 1-on-1 mentorship with a banner image.", color: "bg-lilac" },
  { title: "Get approved", text: "An admin reviews every post before it goes public.", color: "bg-mint" },
  { title: "Accept", text: "Review applicants and accept the students you want.", color: "bg-sky" },
];

function StepGrid({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className={`flex h-full flex-col rounded-2xl border-2 border-ink p-6 shadow-hard ${step.color}`}
        >
          <span className="mb-4 grid size-14 place-items-center rounded-full border-2 border-ink bg-white font-heading text-2xl font-black">
            {i + 1}
          </span>
          <h3 className="font-heading text-xl font-black leading-tight">{step.title}</h3>
          <p className="mt-2 leading-relaxed">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export default function HowItWorksPage() {
  return (
    <main>
      <section className="mx-auto max-w-6xl px-6 pb-6 pt-16">
        <span className="mb-5 inline-block rounded-full border-2 border-ink bg-lemon px-3 py-1 text-sm font-extrabold">
          How it works
        </span>
        <h1 className="font-heading text-5xl font-black leading-[1.04] tracking-tight md:text-6xl">
          Two sides, <span className="rounded-lg bg-lemon px-2">one platform</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-soft">
          Students find verified tutors. Tutors fill their batches. Admins keep every listing honest.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 font-heading text-4xl font-black tracking-tight">For students</h2>
        <StepGrid steps={studentSteps} />
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <h2 className="mb-6 font-heading text-4xl font-black tracking-tight">For tutors</h2>
        <StepGrid steps={tutorSteps} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-6">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border-2 border-ink bg-blue p-8 shadow-hard md:flex-row md:items-center md:p-10">
          <div>
            <h2 className="font-heading text-3xl font-black tracking-tight text-white md:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-2 text-white">Join as a student or a tutor. It is free to begin.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className="rounded-full border-2 border-ink bg-lemon px-6 py-3 font-bold text-ink shadow-hard-sm"
            >
              Sign Up
            </Link>
            <Link
              href="/tuitions"
              className="rounded-full border-2 border-ink bg-white px-6 py-3 font-bold text-ink shadow-hard-sm"
            >
              Browse Tuitions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}