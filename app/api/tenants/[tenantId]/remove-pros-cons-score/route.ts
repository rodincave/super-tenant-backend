import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(req: NextRequest, context: { params: { tenantId: string } }) {
  const tenantId = context.params.tenantId
  if (!tenantId) {
    return NextResponse.json({ error: 'Missing tenantId' }, { status: 400 })
  }
  const supabase = createClient()
  const { error } = await supabase
    .from('tenant_profiles')
    .update({ pros: null, cons: null, score: null })
    .eq('id', tenantId)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
} 