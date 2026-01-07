import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

export async function createProfile(id: string, username: string) {
  const supabase = createClient(cookies())

  const { error } = await supabase.from("profiles").insert({
    id: id,
    display_name: username,
  })

  if (error) {
    console.error("Profiles insert failed:", error)
    throw new Error(error.message)
  }
}
