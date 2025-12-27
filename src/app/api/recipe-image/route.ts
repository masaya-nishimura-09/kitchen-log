import { cookies } from "next/headers"
import { getUserId } from "@/actions/auth"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get("path")

  const userId = await getUserId()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  if (!path?.startsWith(userId)) {
    return new Response("Forbidden", { status: 403 })
  }

  const supabase = createClient(cookies())
  const { data, error } = await supabase.storage
    .from("recipe-images")
    .download(path)

  if (error) {
    return new Response("Internal Server Error", { status: 500 })
  }

  return new Response(data, {
    headers: { "Content-Type": "image/jpeg" },
  })
}
