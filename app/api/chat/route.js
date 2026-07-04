import { getKnowledge } from '@/lib/knowledge';

const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_JSON_CONTENT_TYPE = 'application/json';

function buildSystemPrompt(knowledge) {
  return [
    'Eres el asistente oficial del emprendimiento "Levante".',
    'Debes responder SOLO usando la informacion incluida en el conocimiento local provisto abajo.',
    'Reglas estrictas de comportamiento:',
    '- Responde unicamente con informacion presente en el conocimiento de Levante.',
    '- No inventes, no asumas, no completes huecos y no uses conocimiento externo bajo ninguna circunstancia.',
    '- Si la respuesta no esta en el conocimiento, responde exactamente: "No tengo esa informacion en el conocimiento de Levante".',
    '',
    'Conocimiento de Levante:',
    knowledge,
  ].join('\n');
}

function sanitizeMessages(messages) {
  return messages
    .filter((message) => typeof message?.content === 'string' && typeof message?.role === 'string')
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));
}

export async function POST(request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { message, messages } = body || {};
    const fallbackMessage = Array.isArray(messages)
      ? messages.filter((msg) => msg?.role === 'user' && typeof msg?.content === 'string').at(-1)?.content
      : null;
    const userMessage = typeof message === 'string' ? message : fallbackMessage;

    if (!userMessage) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const GROQ_MODEL = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;

    if (!GROQ_API_KEY) {
      return Response.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const knowledge = getKnowledge();
    const systemPrompt = buildSystemPrompt(knowledge);
    const chatMessages = Array.isArray(messages)
      ? sanitizeMessages(messages)
      : [{ role: 'user', content: userMessage }];

    const requestHeaders = {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      'Content-Type': GROQ_JSON_CONTENT_TYPE,
    };

    const requestBody = {
      model: GROQ_MODEL,
      messages: [{ role: 'system', content: systemPrompt }, ...chatMessages],
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