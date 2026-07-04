const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_JSON_CONTENT_TYPE = 'application/json';

function mapMessagesToGroqFormat(messages) {
  return messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export async function POST(request) {
  const startTime = Date.now();

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;

    if (!GROQ_API_KEY) {
      return Response.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const requestHeaders = {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': GROQ_JSON_CONTENT_TYPE,
    };

    const requestBody = {
      model: GROQ_MODEL,
      messages: mapMessagesToGroqFormat(messages),
      stream: false,
    };

    const groqResponse = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    });

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
  } catch (error) {
    const responseTime = Date.now() - startTime;

    if (error.name === 'AbortError' || error.type === 'aborted') {
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
}