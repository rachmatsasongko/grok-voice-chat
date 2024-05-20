import { NextResponse } from 'next/server';


type PostMessageResponse = {
  threadsId: string;
  runsId: string;
  messagesId: string;
}

export async function POST(request: Request) {
  try {
    const payload: { userId: string, text: string } = await request.json();
    // sending message
    // http://localhost:8000/message/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed/asst_V2Gc1qYaHHiJbm8KwXJd8LCs
    const postMsg = await fetch(`${process.env.API_HOST}/message/${payload.userId}/${process.env.ASSISTANT_ID}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: payload.text }),
      cache: 'no-store'
    });
    const postRes: PostMessageResponse = await postMsg.json();
    return NextResponse.json(postRes);
  } catch (err) {
    return NextResponse.error();
  }
}
