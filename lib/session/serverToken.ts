import { redirect } from "next/navigation"
import { getServerSession } from "./serverSession"

export const getServerToken = async () => {
  const session = await getServerSession()
  if (!session || !session.session.token) {
    redirect("/unauthorized")
  }
  return session.session.token
}
