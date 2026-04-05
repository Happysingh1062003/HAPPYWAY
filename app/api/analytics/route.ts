import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    score: 62,
    history: [
      { date: '2024-01', score: 28 },
      { date: '2024-02', score: 32 },
      { date: '2024-03', score: 38 },
      { date: '2024-04', score: 42 },
      { date: '2024-05', score: 48 },
      { date: '2024-06', score: 52 },
      { date: '2024-07', score: 55 },
      { date: '2024-08', score: 58 },
      { date: '2024-09', score: 60 },
      { date: '2024-10', score: 62 },
    ],
    criteriaScores: {
      awards: 65, membership: 45, press: 72,
      judging: 58, original_contributions: 78,
      scholarly_articles: 82, critical_role: 35,
      high_salary: 20, commercial_success: 0,
    },
    evidenceCount: 14,
    criteriaCovered: 6,
  });
}
