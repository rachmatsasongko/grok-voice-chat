import OpenAI from 'openai';
import fs from 'fs';

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw 'Please provide OPENAI_API_KEY to environment.';

const openAi = new OpenAI({
  apiKey,
  // dangerouslyAllowBrowser: true
})

export const createSpeech = async (text: string) => {
  const response = await openAi.audio.speech.create({
    model: "tts-1",
    voice: "nova",
    input: text,
  })

  const buffer = await response.arrayBuffer();

  const filename = `transcript.wav`
  
  fs.writeFile(`./public/audio/${filename}`, Buffer.from(buffer), (err) => {
    if (err) {
      console.error('Error writing audio to file:', err);
    } else {
      console.log('Audio file written to output.wav');
    }
  });

  return filename;
}