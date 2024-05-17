import { ConvaiClient } from 'convai-web-sdk';

const apiKey = process.env.NEXT_PUBLIC_CONVAI_API_KEY;
if (!apiKey) throw 'Please provide CONVAI_API_KEY to environment.';

const convaiClient = new ConvaiClient({
  apiKey,
  characterId: '8565e00c-146e-11ef-91e3-42010a7be00e',
  enableAudio: true,
  sessionId: '-1',
  speaker: '',
  speakerId: ''
});

convaiClient.setResponseCallback((res) => { });

export const getResponse = (text: string) => {
  convaiClient.sendTextChunk(text);
}