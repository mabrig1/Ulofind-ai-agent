import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { connectDB } from '@/lib/mongodb';
import Listing from '@/models/Listing';
import HousingMission from '@/models/HousingMission';
import { cleanText } from '@/lib/security';

const client = new Anthropic();

const SYSTEM = `You are Ada Housing Agent, an AI housing concierge for Nigeria, starting with Nsukka/UNN.
Convert the user's housing request into JSON only:
{"intent":"rent"|"buy"|"shop"|"unknown","budgetMax":number|null,"preferredLocations":[],"housingTypes":[],"nearUNN":boolean|null,"summary":""}
Never invent listings, prices, verification, ownership, availability or legal status. The database is the source of truth.`;

function parseJson(text: string) {
  return JSON.parse(text.trim().replace(/^\`\`\`(?:json)?\s*/i,'').replace(/\s*\`\`\`$/,''));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = cleanText(body.message, 2000);
    const sessionId = cleanText(body.sessionId, 120) || crypto.randomUUID();
    if (!message) return NextResponse.json({ error: 'Tell Ada what kind of home or shop you need.' }, { status: 400 });

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 500,
      temperature: 0,
      system: SYSTEM,
      messages: [{ role: 'user', content: message }],
    });
    const block = response.content.find(x => x.type === 'text');
    if (!block || block.type !== 'text') throw new Error('No model response');
    const intent = parseJson(block.text);

    await connectDB();
    const filter: Record<string, any> = { available: true, moderationStatus: 'approved' };
    if (intent.intent === 'shop') filter.category = { $in: ['town-shop','campus-shop'] };
    else if (intent.intent === 'rent' || intent.intent === 'buy') filter.category = 'housing';
    if (Number.isFinite(intent.budgetMax) && intent.budgetMax > 0) filter.price = { $lte: intent.budgetMax };
    if (intent.nearUNN === true) filter.nearUNN = true;
    if (Array.isArray(intent.housingTypes) && intent.housingTypes.length) filter.housingType = { $in: intent.housingTypes.slice(0, 5) };

    const candidates = await Listing.find(filter).sort({ verified: -1, featured: -1, postedAt: -1 }).limit(24).lean();
    const terms = Array.isArray(intent.preferredLocations) ? intent.preferredLocations.map((x: unknown) => cleanText(x,80).toLowerCase()).filter(Boolean) : [];
    const ranked = candidates.map((l: any) => {
      let score = 50;
      if (l.verified) score += 20;
      if (l.featured) score += 5;
      if (intent.nearUNN === true && l.nearUNN) score += 15;
      const place = [l.location,l.townArea,l.campusZone].filter(Boolean).join(' ').toLowerCase();
      if (terms.some((t: string) => place.includes(t))) score += 20;
      if (intent.budgetMax && l.price <= intent.budgetMax) score += Math.min(10, Math.round((1 - l.price / intent.budgetMax) * 10));
      return { ...l, matchScore: Math.min(100, score) };
    }).sort((a:any,b:any)=>b.matchScore-a.matchScore).slice(0,6);

    await HousingMission.create({
      sessionId, userMessage: message, intent: intent.intent || 'unknown',
      budgetMax: intent.budgetMax || undefined,
      preferredLocations: terms,
      housingTypes: Array.isArray(intent.housingTypes) ? intent.housingTypes.slice(0,5) : [],
      nearUNN: intent.nearUNN ?? undefined,
      shortlist: ranked.map((x:any)=>x._id),
      stage: ranked.length ? 'shortlist' : 'discover',
    });

    return NextResponse.json({
      sessionId,
      understood: intent.summary || 'Housing request understood.',
      matches: JSON.parse(JSON.stringify(ranked)),
      nextAction: ranked.length ? 'Compare the shortlist, then screen and physically verify your preferred property before payment.' : 'Broaden the location, property type, or budget to find more matches.',
      safeguards: ['AI match scores are recommendations, not guarantees.','Verified status must come from UloFind human verification, not AI inference.','Do not pay until identity, authority, property and documents are independently checked.'],
    });
  } catch (error) {
    console.error('Ada housing agent failed', error);
    return NextResponse.json({ error: 'Ada Housing Agent is temporarily unavailable.' }, { status: 502 });
  }
}
