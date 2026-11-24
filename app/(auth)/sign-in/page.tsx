"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

import { authClient, signIn } from "@/lib/auth-client"

const inputClass =
  "h-14 w-full rounded-[15px] border-2 border-[#171717] bg-white px-4 text-base text-[#171717] shadow-none placeholder:text-gray-400 focus-visible:border-[#4038F5] focus-visible:ring-2 focus-visible:ring-[#4038F5]/20"

const labelClass = "text-base font-semibold text-[#171717]"

export default function SignInPage() {
  const router = useRouter()

  const [submitting, setSubmitting] = React.useState(false)

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    setSubmitting(true)

    try {
      const { error } = await authClient.signIn.email({
        email: String(form.get("email")).trim(),
        password: String(form.get("password")),
      })

      if (error) {
        toast.error(error.message || "Invalid email or password")
        return
      }

      toast.success("Welcome back!")
      router.push("/")
      router.refresh()
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch {
      toast.error("Google sign-in failed. Please try again.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#4038F5] px-4 py-10">
      <section className="w-full max-w-150 rounded-[20px] border-2 border-[#171717] bg-white px-7 py-10 shadow-[6px_7px_0_#171717] sm:px-11 sm:py-11">
        {/* Logo */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#171717] bg-[#4038F5] text-xl font-extrabold text-white">
            ML
          </div>

          <span className="text-[27px] font-extrabold tracking-tight text-[#171717]">
            MentorLagbe
          </span>
        </div>

        {/* Heading */}
        <h1 className="mb-5 text-[42px] leading-[1.08] font-extrabold tracking-tight text-[#171717] sm:text-[48px]">
          Welcome back
        </h1>

        <form onSubmit={handleEmailSignIn}>
          <FieldGroup className="gap-5">
            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email" className={labelClass}>
                Email
              </FieldLabel>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={inputClass}
                required
              />
            </Field>

            {/* Password */}
            <Field>
              <FieldLabel htmlFor="password" className={labelClass}>
                Password
              </FieldLabel>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={inputClass}
                required
              />
            </Field>

            {/* Sign In */}
            <Field>
              <Button
                type="submit"
                disabled={submitting}
                className="h-15 w-full cursor-pointer rounded-full border-2 border-[#171717] bg-[#4038F5] text-lg font-bold text-white shadow-[4px_5px_0_#171717] transition hover:bg-[#342CE0] hover:shadow-[4px_6px_0_#171717] active:translate-y-1 active:shadow-none disabled:opacity-60"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}

                {submitting ? "Signing in..." : "Sign In"}
              </Button>
            </Field>

            {/* Google Sign In */}
            <Field>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                className="h-15 w-full cursor-pointer rounded-full border-2 border-[#171717] bg-white text-lg font-bold text-[#171717] shadow-[4px_5px_0_#171717] transition hover:bg-gray-50 hover:shadow-[4px_6px_0_#171717] active:translate-y-1 active:shadow-none"
              >
                <FcGoogle className="size-5" />
                Continue with Google
              </Button>
            </Field>
          </FieldGroup>
        </form>

        {/* Sign Up */}
        <p className="mt-6 text-base text-[#555566]">
          New here?{" "}
          <Link
            href="/sign-up"
            className="font-bold text-[#555566] underline underline-offset-2 hover:text-[#4038F5]"
          >
            Sign Up
          </Link>
        </p>
      </section>
    </main>
  )
}
