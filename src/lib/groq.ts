// const Groq = require('groq-sdk');
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) throw 'Please provide API KEY to environment.';

const groq = new Groq({
  apiKey
});

export const generateAnswer = async (text: string) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: text
      }
    ],
    model: "llama3-8b-8192",
    temperature: 1,
    max_tokens: 1024,
    top_p: 1,
    stream: true,
    stop: null
  });

  let response = '';
  for await (const chunk of chatCompletion) {
    response += chunk.choices[0]?.delta?.content || '';
  }
  return response;
}
