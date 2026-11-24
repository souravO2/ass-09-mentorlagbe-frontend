"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-lilac px-6 py-16 text-center">
      <p className="font-heading text-[clamp(5rem,18vw,9rem)] font-black leading-[0.9] tracking-tight">
        Oops
      </p>
      <h1 className="font-heading text-3xl font-black tracking-tight md:text-4xl">
        Something went wrong
      </h1>
      <p className="max-w-md text-lg">
        An unexpected error occurred. You can try again, or head back to the home page.
      </p>
      {error.digest && (
        <p className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-bold">
          Error ID: {error.digest}
        </p>
      )}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full border-2 border-ink bg-white px-6 py-3 font-bold text-ink shadow-hard-sm"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border-2 border-ink bg-blue px-6 py-3 font-bold text-white shadow-hard-sm"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
