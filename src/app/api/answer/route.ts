import { NextResponse } from 'next/server';
// import { createAudioFileFromText } from '@/lib/deppgram';
import OpenAI from 'openai';
import fs from 'fs';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw 'Please provide OPENAI_API_KEY to environment.';

const openAi = new OpenAI({
  apiKey,
  // dangerouslyAllowBrowser: true
})

type GetMessageResponse = {
  message: string;
}

export async function POST(request: Request) {
  try {
    const payload: { userId: string } = await request.json();
    // retrieve message response
    const getMsg = await fetch(`http://157.245.65.134/message/${payload.userId}/asst_V2Gc1qYaHHiJbm8KwXJd8LCs`, {
      cache: 'no-store'
    });
    const getRes: GetMessageResponse = await getMsg.json();
  
    const response = await openAi.audio.speech.create({
      model: "tts-1-hd",
      voice: "shimmer",
      input: getRes.message,
    })
  
    const buffer = await response.arrayBuffer();
  
    const filename = `transcript.wav`
    
    fs.writeFileSync(`./public/audio/${filename}`, Buffer.from(buffer));
    console.log('Audio file written to output.wav');
    // const answer = await generateAnswer(getRes.message);
    // await createAudioFileFromText(answer);
    return NextResponse.json({
      text: getRes.message
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}
