import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function DELETE(_req: NextRequest) {
  const supabase = createClient()
  const { error } = await supabase.from("properties").delete().neq("id", null)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 