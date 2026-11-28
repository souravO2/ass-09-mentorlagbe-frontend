import "server-only"
import { getServerToken } from "./session/serverToken"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function checkoutVerify(
  sessionId: string
): Promise<{ ok: boolean; message?: string }> {
  const token = await getServerToken() // Fetch the server token for authentication
  try {
    const res = await fetch(
      `${API_URL}/payments/checkout-verify?sessionId=${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, // Use the server token for authorization
        },
        body: JSON.stringify({ sessionId }),
        cache: "no-store",
      }
    )

    const data = await res.json().catch(() => ({}))
    return { ok: res.ok && data.ok === true, message: data.message }
  } catch {
    return { ok: false, message: "Could not reach the server" }
  }
}
