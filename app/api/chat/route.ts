import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

    if (!GROQ_API_KEY) {
      return Response.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: messages.map((msg: { role: string; content: string }) => ({
            role: msg.role,
            content: msg.content,
          })),
          stream: false,
        }),
      }
    );

    const responseTime = Date.now() - startTime;

    if (!groqResponse.ok) {
      const errorData = await groqResponse.json().catch(() => ({}));
      const status = groqResponse.status;

      if (status === 429) {
        return Response.json(
          { error: 'Rate limit exceeded. Please wait a moment before sending another message.' },
          { status: 429 }
        );
      }

      if (status === 401) {
        return Response.json(
          { error: 'Invalid API key. Please check your GROQ_API_KEY.' },
          { status: 401 }
        );
      }

      return Response.json(
        { error: errorData.error?.message || `Groq API error: ${status}` },
        { status }
      );
    }

    const data = await groqResponse.json();

    const responseMessage = data.choices?.[0]?.message;
    const usage = data.usage || {};
    const model = data.model || GROQ_MODEL;

    if (!responseMessage?.content) {
      return Response.json(
        { error: 'Empty response from Groq API' },
        { status: 502 }
      );
    }

    return Response.json({
      message: {
        role: 'assistant',
        content: responseMessage.content,
      },
      usage: {
        prompt_tokens: usage.prompt_tokens || 0,
        completion_tokens: usage.completion_tokens || 0,
        total_tokens: usage.total_tokens || 0,
      },
      model,
      response_time: responseTime,
    });
  } catch (error: unknown) {
    const responseTime = Date.now() - startTime;

    if (error instanceof Error) {
      if (error.name === 'AbortError' || (error as any).type === 'aborted') {
        return Response.json(
          { error: 'Request timed out. Please try again.' },
          { status: 504 }
        );
      }

      if (error.message?.includes('fetch') || error.message?.includes('ENOTFOUND')) {
        return Response.json(
          { error: 'Network error. Please check your internet connection.' },
          { status: 503 }
        );
      }

      return Response.json(
        { error: error.message || 'Internal server error' },
        { status: 500 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}