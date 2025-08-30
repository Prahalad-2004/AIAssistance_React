/** AI Client with OpenAI-compatible default, plus a stub fallback. */

const BASE_URL = process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1';
const MODEL = process.env.OPENAI_MODEL || 'google/gemini-flash-1.5';

export async function chatCompletion(messages) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fallback stub so the app still works in dev without keys
    return `🔧 (stub) You said: "${messages[messages.length - 1]?.content ?? ''}"`;
  }

  // Convert to a simple prompt for providers that accept a single string
  const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  // OpenAI Responses API style
  const res = await fetch(`${BASE_URL}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'AI Virtual Assistant'
  },
  body: JSON.stringify({
    model: MODEL,
    messages,
    temperature: 0.7
  })
});

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI error ${res.status}: ${text}`);
  }

  const data = await res.json();
  // Try to normalize common response shapes
  const candidate = data?.output_text || data?.content?.[0]?.text || data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
  return candidate || 'I could not generate a response.';
}
