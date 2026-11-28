import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"

// This function can be marked `async` if using `await` inside
async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session?.user) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
}
export default proxy

export const config = {
  matcher: ["/profile", "/dashboard/:path", "/tuitions/:path"],
}
