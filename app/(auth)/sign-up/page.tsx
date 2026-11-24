"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

import { authClient, signIn } from "@/lib/auth-client"
import { FcGoogle } from "react-icons/fc"

const inputClass =
  "h-14 w-full rounded-[15px] border-2 border-[#171717] bg-white px-4 text-base text-[#171717] shadow-none placeholder:text-gray-400 focus-visible:border-[#4038F5] focus-visible:ring-2 focus-visible:ring-[#4038F5]/20"

const labelClass = "text-base font-semibold text-[#171717]"

type UserRole = "student" | "tutor"

export default function SignUpPage() {
  const router = useRouter()

  const [role, setRole] = React.useState<UserRole>("student")
  const [password, setPassword] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(false)

  const rules = [
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
    { label: "At least 6 characters", ok: password.length >= 6 },
  ]

  const passwordValid = rules.every((rule) => rule.ok)

  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!passwordValid) {
      toast.error("Your password does not meet the requirements")
      return
    }

    const form = new FormData(e.currentTarget)

    setSubmitting(true)

    try {
      const { error } = await authClient.signUp.email({
        name: String(form.get("name")).trim(),
        email: String(form.get("email")).trim(),
        password,
        role,
      })

      if (error) {
        toast.error(error.message || "Could not create your account")
        return
      }

      toast.success("Account created successfully!")
      router.push("/sign-in")
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
    console.log(form)
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
      <section className="w-full max-w-[570px] rounded-[20px] border-2 border-[#171717] bg-white px-7 py-9 shadow-[6px_7px_0_#171717] sm:px-10 sm:py-10">
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
        <h1 className="mb-6 max-w-[390px] text-[42px] leading-[1.08] font-extrabold tracking-tight text-[#171717] sm:text-[48px]">
          Create your account
        </h1>

        <form onSubmit={handleEmailSignUp}>
          <FieldGroup className="gap-5">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                aria-pressed={role === "student"}
                className={`h-[70px] rounded-[19px] border-2 border-[#171717] text-lg font-bold transition ${
                  role === "student"
                    ? "-translate-y-0.5 bg-[#FFDA3F] shadow-[0_6px_0_#171717]"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                Student
              </button>

              <button
                type="button"
                onClick={() => setRole("tutor")}
                aria-pressed={role === "tutor"}
                className={`h-[70px] rounded-[19px] border-2 border-[#171717] text-lg font-bold transition ${
                  role === "tutor"
                    ? "-translate-y-0.5 bg-[#FFDA3F] shadow-[0_6px_0_#171717]"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                Tutor
              </button>
            </div>

            {/* Full Name */}
            <Field>
              <FieldLabel htmlFor="name" className={labelClass}>
                Full name
              </FieldLabel>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder=""
                autoComplete="name"
                className={inputClass}
                required
              />
            </Field>

            {/* Email */}
            <Field>
              <FieldLabel htmlFor="email" className={labelClass}>
                Email
              </FieldLabel>

              <Input
                id="email"
                name="email"
                type="email"
                placeholder=""
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

              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#555566] hover:text-[#4038F5]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>

            {/* Password Requirements */}
            {password.length > 0 && (
              <div className="space-y-1 text-xs">
                {rules.map((rule) => (
                  <p
                    key={rule.label}
                    className={rule.ok ? "text-green-600" : "text-gray-500"}
                  >
                    {rule.ok ? "✓" : "○"} {rule.label}
                  </p>
                ))}
              </div>
            )}

            {/* Submit */}
            <Field>
              <Button
                type="submit"
                disabled={submitting}
                className="h-[60px] w-full cursor-pointer rounded-full border-2 border-[#171717] bg-[#4038F5] text-lg font-bold text-white shadow-[4px_5px_0_#171717] transition hover:bg-[#342CE0] hover:shadow-[4px_6px_0_#171717] active:translate-y-1 active:shadow-none disabled:opacity-60"
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {submitting ? "Creating account..." : "Sign Up"}
              </Button>
            </Field>

            {/* Google */}
            <Field>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                className="h-12 w-full cursor-pointer rounded-full border-2 border-[#171717] bg-white font-bold text-[#171717] hover:bg-gray-50"
              >
                <FcGoogle className="size-5" />
                Continue with Google
              </Button>
            </Field>

            {/* Sign In */}
            <FieldDescription className="pt-1 text-center text-base text-[#555566]">
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#555566] underline underline-offset-2 hover:text-[#4038F5]"
              >
                Sign In
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </section>
    </main>
  )
}
