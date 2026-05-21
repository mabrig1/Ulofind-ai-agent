import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { connectDB } from '@/lib/mongodb';
import FraudReport from '@/models/FraudReport';

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  const message = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a fraud detection assistant for a Nigerian student housing and shop listings platform. Analyze the following listing text and respond with a JSON object containing:
- verdict: "safe" | "suspicious" | "likely_fraud"
- confidence: number between 0 and 1
- reasoning: a brief explanation

Listing text:
${text}

Respond with only valid JSON, no markdown.`,
      },
    ],
  });

  const raw = (message.content[0] as { type: string; text: string }).text;
  const parsed = JSON.parse(raw);

  await connectDB();
  await FraudReport.create({ input: text, ...parsed });

  return NextResponse.json(parsed);
}
