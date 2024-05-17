import { createClient } from '@deepgram/sdk';
import fs from 'fs';

const apiKey = process.env.DEEPGRAM_API_KEY;
if (!apiKey) throw 'Please provide DEEPGRAM_API_KEY to environment.';

const deepgram = createClient(apiKey);

const getAudioBuffer = async (response: any) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};

export const transcribeAudioFileToText = async () => {
  const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
    fs.readFileSync('output.wav'), {
    model: 'nova-2',
    smart_format: true,
  }
  );

  if (error) throw error;
  if (!error) console.log(result.results.channels[0].alternatives[0].transcript);
};

export const createAudioFileFromText = async (text: string) => {
  const response = await deepgram.speak.request(
    { text },
    {
      model: 'aura-asteria-en',
      encoding: 'linear16',
      container: 'wav',
    }
  );

  const stream = await response.getStream();
  const headers = await response.getHeaders();

  if (stream) {
    const buffer = await getAudioBuffer(stream);

    fs.writeFile('./public/audio/transcript.wav', buffer, (err) => {
      if (err) {
        console.error('Error writing audio to file:', err);
      } else {
        console.log('Audio file written to output.wav');
      }
    });
  } else {
    // console.error('Error generating audio:', stream);
  }

  if (headers) {
    // console.log('Headers:', headers);
  }
};
