import { google } from '@ai-sdk/google';
import { streamText, type ModelMessage } from 'ai';

/**
 * Vercel Serverless Function - Chat Endpoint
 * Güvenlik: API anahtarı sunucu tarafında (environment variable) saklanır, istemciye sızmaz.
 * Kötüye kullanıma karşı: sadece aynı origin'den gelen istekler, sınırlı mesaj sayısı/uzunluğu,
 * sabit senaryo listesi ve çıktı token limiti uygulanır.
 */
export const config = {
  runtime: 'edge',
};

const ALLOWED_SCENARIOS = ['Genel Sohbet', 'Havaalanı', 'Restoran', 'İş Görüşmesi'];
const MAX_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 2000;
const MAX_BODY_BYTES = 64 * 1024;

const jsonError = (status: number, error: string) =>
  new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// Hem eski ({ content }) hem yeni ({ parts: [{ type: 'text', text }] }) mesaj biçimini düz metne çevirir
function extractText(message: any): string {
  if (typeof message?.content === 'string') return message.content;
  if (Array.isArray(message?.parts)) {
    return message.parts
      .filter((p: any) => p?.type === 'text' && typeof p.text === 'string')
      .map((p: any) => p.text)
      .join('');
  }
  return '';
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') return jsonError(405, 'Method not allowed');

  // Başka sitelerin bu endpoint'i (ve API kotasını) kullanmasını engelle
  const origin = req.headers.get('origin');
  if (!origin || new URL(origin).host !== new URL(req.url).host) {
    return jsonError(403, 'Forbidden');
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return jsonError(413, 'Request too large');

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError(400, 'Invalid JSON');
  }

  if (!Array.isArray(body?.messages)) return jsonError(400, 'Invalid messages');

  // Sadece user/assistant rolleri kabul edilir; istemci system mesajı enjekte edemez
  const messages: ModelMessage[] = body.messages
    .filter((m: any) => m?.role === 'user' || m?.role === 'assistant')
    .slice(-MAX_MESSAGES)
    .map((m: any) => ({ role: m.role, content: extractText(m).slice(0, MAX_MESSAGE_CHARS) }))
    .filter((m: ModelMessage) => m.content);

  if (messages.length === 0) return jsonError(400, 'No messages');

  const scenario = ALLOWED_SCENARIOS.includes(body.scenario) ? body.scenario : 'general';

  try {
    // Senaryoya göre sistem talimatını özelleştir
    const systemPrompt = `
      You are an expert English Teacher. Your goal is to help the user practice English in a ${scenario} setting.

      RULES:
      1. Always stay in character for the chosen scenario (${scenario}).
      2. If the user makes a grammar or vocabulary mistake, gently correct them at the end of your response using this format:
         "Correction: [corrected sentence] (Reason: [brief explanation])"
      3. Encourage the user to speak more by asking open-ended questions.
      4. Use a friendly, professional, and encouraging tone.
      5. If the user's English is perfect, compliment them!
    `;

    const result = streamText({
      model: google('models/gemini-2.5-flash'),
      messages,
      system: systemPrompt,
      maxOutputTokens: 800,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('AI Error:', error);
    return jsonError(500, 'AI Error occurred');
  }
}
