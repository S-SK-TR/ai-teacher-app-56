import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

/**
 * Vercel Serverless Function - Chat Endpoint
 * Güvenlik: API anahtarı sunucu tarafında (environment variable) saklanır, istemciye sızmaz.
 */
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  try {
    const { messages, scenario } = await req.json();

    // Senaryoya göre sistem talimatını özelleştir
    const systemPrompt = `
      You are an expert English Teacher. Your goal is to help the user practice English in a ${scenario || 'general'} setting.
      
      RULES:
      1. Always stay in character for the chosen scenario (${scenario}).
      2. If the user makes a grammar or vocabulary mistake, gently correct them at the end of your response using this format: 
         "Correction: [corrected sentence] (Reason: [brief explanation])"
      3. Encourage the user to speak more by asking open-ended questions.
      4. Use a friendly, professional, and encouraging tone.
      5. If the user's English is perfect, compliment them!
    `;

    const result = await streamText({
      model: google('models/gemini-2.5-flash'),
      messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('AI Error:', error);
    return new Response(JSON.stringify({ error: 'AI Error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
