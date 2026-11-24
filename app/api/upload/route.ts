import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image")

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      )
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be smaller than 5MB" },
        { status: 400 }
      )
    }

    const apiKey = process.env.IMGBB_API_KEY
    if (!apiKey) {
      throw new Error("ImgBB API key is missing")
    }

    const uploadData = new FormData()
    uploadData.append("image", image)

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: uploadData,
      }
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error?.message || "ImgBB upload failed")
    }

    return NextResponse.json({
      success: true,
      url: result.data.url,
    })
  } catch (error) {
    console.error("Image upload error:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Image upload failed",
      },
      { status: 500 }
    )
  }
}
