import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { connectDB } from '@/lib/mongodb';
import FraudReport from '@/models/FraudReport';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are Ada, an expert Nigerian real estate fraud detection agent specializing in Nsukka, Enugu State properties. You analyze property documents and descriptions to detect common Nigerian real estate scams including: fake landlords, double-renting, forged tenancy agreements, Omonile fraud, fake allocation letters for UNN campus shops, collecting fees and disappearing, and sublet scams.

Analyze the provided information and return ONLY a JSON object with:
{
  "riskLevel": "safe" | "caution" | "danger",
  "score": number (0-100, 100 = completely safe),
  "redFlags": string[],
  "greenFlags": string[],
  "recommendation": string,
  "nextSteps": string[]
}

Be specific to Nigerian/Nsukka context.
For campus shops: check for UNN allocation letter legitimacy.
For housing: check for proper tenancy agreement clauses.
Never guess safe - err on side of caution.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { documentsUploaded, propertyType, userDescription, engisResult, listingId } = body;

  if (!propertyType) {
    return NextResponse.json({ error: 'propertyType is required' }, { status: 400 });
  }

  const parts: string[] = [`Property Type: ${propertyType}`];
  if (userDescription) parts.push(`User Description:\n${userDescription}`);
  if (engisResult) parts.push(`ENGIS/Land Registry Result:\n${engisResult}`);
  if (documentsUploaded?.length) {
    parts.push(`Documents uploaded (${documentsUploaded.length}): ${documentsUploaded.join(', ')}`);
  }

  const userMessage = parts.join('\n\n');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();

  // Strip markdown code fences if the model wraps the JSON
  const jsonText = raw.startsWith('```') ? raw.replace(/```[a-z]*\n?/g, '').trim() : raw;
  const aiAnalysis = JSON.parse(jsonText);

  await connectDB();
  const report = await FraudReport.create({
    listingId: listingId ?? undefined,
    documentsUploaded: documentsUploaded ?? [],
    propertyType,
    userDescription,
    engisResult,
    aiAnalysis,
  });

  return NextResponse.json({ reportId: report._id, aiAnalysis });
}
