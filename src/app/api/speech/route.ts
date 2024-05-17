import { NextResponse } from 'next/server';
import { createAudioFileFromText } from '@/lib/deppgram';
import { generateAnswer } from '@/lib/groq';


export async function GET(request: Request) {
  const payload: { text: string } = await request.json();
  const answer = await generateAnswer('Tell me a joke');
  return NextResponse.json({
    test: "test"
  })
}

export async function POST(request: Request) {
  const payload: { text: string } = await request.json();
  const answer = await generateAnswer(payload.text);
  await createAudioFileFromText(answer);
  return NextResponse.json({
    text: answer
  });
}
