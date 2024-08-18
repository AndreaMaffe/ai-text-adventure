import { callAnthropic } from '@/lib/anthropic'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  const text = await callAnthropic(prompt)

  return NextResponse.json({ text })
}
