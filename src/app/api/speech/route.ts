import { NextResponse } from 'next/server';
import { createSpeech } from '@/lib/openai';

export async function POST(request: Request) {
  const payload: { text: string } = await request.json();
  const fileName = await createSpeech(payload.text);
  return NextResponse.json({
    fileName
  });
}
