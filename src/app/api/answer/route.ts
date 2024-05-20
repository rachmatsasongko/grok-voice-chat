export async function POST(request: Request) {
  try {
    const payload: { userId: string } = await request.json();
    // retrieve message response
    const getMsg = await fetch(`${process.env.API_HOST}/message/${payload.userId}/${process.env.ASSISTANT_ID}`, {
      cache: 'no-store'
    });

    return getMsg;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
