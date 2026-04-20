import { evidenceItems } from './schema';

type EvidenceItem = typeof evidenceItems.$inferSelect;

export interface CriterionHealth {
  count: number;
  score: number;
}

export interface ScoreProfile {
  overallScore: number;
  criteriaCovered: number; // Categories with at least 'moderate' coverage
  totalEvidenceCount: number;
  criterionData: Record<string, CriterionHealth>;
}

// Map the DB enum to point value aligned with UI thresholds
const STRENGTH_POINTS = {
  weak: 20,
  solid: 65,
  compelling: 90,
};

// Must match schema definition
const ALL_CRITERIA = [
  'awards', 'membership', 'press', 'judging', 'original_contributions',
  'scholarly_articles', 'critical_role', 'high_salary', 'commercial_success'
];

export function calculateApprovalProbability(items: EvidenceItem[]): ScoreProfile {
  // Initialize payload
  const criterionData: Record<string, CriterionHealth> = {};
  ALL_CRITERIA.forEach((c) => {
    criterionData[c] = { count: 0, score: 0 };
  });

  // Calculate points per criterion
  for (const item of items) {
    if (!item.criterion || (!item.strength && !item.strengthScore)) continue;
    
    // Utilize strengthScore directly, otherwise fallback to basic strength mapping.
    const pts = item.strengthScore || STRENGTH_POINTS[item.strength as keyof typeof STRENGTH_POINTS] || 0;
    
    criterionData[item.criterion].count += 1;
    criterionData[item.criterion].score += pts;
  }

  // Cap scores at 100
  let criteriaCoveredCount = 0;
  let rawScorePool = 0;

  for (const key in criterionData) {
    if (criterionData[key].score > 100) {
      criterionData[key].score = 100;
    }
    
    // We consider it "covered" if score >= 40 (Moderate)
    if (criterionData[key].score >= 40) {
      criteriaCoveredCount++;
    }

    rawScorePool += criterionData[key].score;
  }

  // Calculate Probability (1-100)
  // Base expectation for EB1/O1 is 3 highly rated criteria.
  // 3 criteria * 100max = 300 points is the "golden standard target".
  
  let overallScore = 0;

  if (criteriaCoveredCount === 0) {
    overallScore = 0;
  } else if (criteriaCoveredCount === 1) {
    // Heavily penalized, hard cap around 20%
    overallScore = Math.min(20, Math.round((rawScorePool / 300) * 100));
  } else if (criteriaCoveredCount === 2) {
    // Borderline, hard cap around 40%
    overallScore = Math.min(45, Math.round((rawScorePool / 300) * 100));
  } else {
    // 3 or more criteria met. 
    // They get a huge baseline boost just for hitting the legal 3 milestone.
    overallScore = Math.min(100, Math.round((rawScorePool / 300) * 100));
    
    // Add small bonus for having 4+ criteria
    if (criteriaCoveredCount > 3) {
      overallScore = Math.min(100, overallScore + (criteriaCoveredCount - 3) * 5);
    }
  }

  return {
    overallScore,
    criteriaCovered: criteriaCoveredCount,
    totalEvidenceCount: items.length,
    criterionData
  };
}
