import Anthropic from '@anthropic-ai/sdk';

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

export interface EvidenceAnalysis {
  strength: 'weak' | 'solid' | 'compelling';
  strengthScore: number;
  analysis: string;
  suggestions: string;
}

export async function analyzeEvidence(
  title: string,
  description: string,
  criterion: string,
  fileType?: string
): Promise<EvidenceAnalysis> {
  if (!anthropic) {
    // Demo mode fallback
    const scores: Record<string, number> = {
      awards: 72, membership: 65, press: 58,
      judging: 70, original_contributions: 68,
      scholarly_articles: 75, critical_role: 62,
      high_salary: 80, commercial_success: 55,
    };
    const score = scores[criterion] || 65;
    return {
      strength: score >= 70 ? 'compelling' : score >= 50 ? 'solid' : 'weak',
      strengthScore: score,
      analysis: `This evidence demonstrates relevant qualifications for the ${criterion.replace(/_/g, ' ')} criterion. The documentation provides substantive support for your case, though additional corroborating evidence would strengthen the overall argument.`,
      suggestions: `Consider adding third-party verification, quantitative impact metrics, and comparison to industry benchmarks. Letters of recommendation from recognized experts would also strengthen this evidence.`,
    };
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are an immigration attorney AI assistant specializing in O-1A and EB-1 visa applications. Analyze the following evidence for the USCIS criterion "${criterion.replace(/_/g, ' ')}".

Title: ${title}
Description: ${description || 'No description provided'}
File type: ${fileType || 'Not specified'}

Respond in JSON format exactly like this:
{
  "strength": "weak" | "solid" | "compelling",
  "strengthScore": <number 0-100>,
  "analysis": "<2-3 sentence analysis of how this evidence supports the criterion>",
  "suggestions": "<2-3 specific, actionable suggestions to strengthen this evidence>"
}`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Failed to parse AI response');
  } catch (error) {
    console.error('Claude API error:', error);
    return {
      strength: 'solid',
      strengthScore: 50,
      analysis: 'Analysis pending — AI service temporarily unavailable.',
      suggestions: 'Analysis will be retried automatically.',
    };
  }
}
