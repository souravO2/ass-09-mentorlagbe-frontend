import "server-only"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function checkoutVerify(
  sessionId: string
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch(
      `${API_URL}/payments/checkout-verify?sessionId=${sessionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
