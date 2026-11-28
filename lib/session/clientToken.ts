"use client"

import { useSession } from "../auth-client"

export const useClientToken = () => {
  const { data: session } = useSession()
  return session?.session.token
}
