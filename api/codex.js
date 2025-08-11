import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic = '', style = 'punchy', lang = 'ru', extras = '' } = req.body || {};

  const styleMap = {
    punchy: 'short, punchy, engaging',
    witty: 'witty, clever wordplay',
    romantic: 'warm, romantic tone',
    travel: 'travel vibe, sense of discovery',
    promo: 'conversion-focused, clear CTA'
  };

  const prompt = `Generate 5 Instagram captions for the topic: "${topic}". Style: ${styleMap[style]}. Language: ${lang}. Extra: ${extras}. Separate captions with a blank line.`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a caption generator for Instagram.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8,
      max_tokens: 200
    });

    const text = completion?.choices?.[0]?.message?.content?.trim() || '';
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

