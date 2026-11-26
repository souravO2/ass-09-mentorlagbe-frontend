"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function DashboardIndex() {
  const router = useRouter()
  const { data, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && data?.user) {
      router.replace(`/dashboard/${data.user.role ?? "student"}`)
    }
  }, [isPending, data, router])

  return null
}
