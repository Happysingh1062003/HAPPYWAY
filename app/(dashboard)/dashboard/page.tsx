import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { evidenceItems } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import DashboardClient from './DashboardClient';
import { calculateApprovalProbability } from '@/lib/score';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const userId = (session.user as any).id;
  if (!userId) {
    redirect('/login');
  }

  // Fetch real evidence items from the database
  let items: any[] = [];
  try {
    if (process.env.DATABASE_URL) {
      items = await db
        .select()
        .from(evidenceItems)
        .where(eq(evidenceItems.userId, userId))
        .orderBy(desc(evidenceItems.createdAt));
    } else {
      console.warn("No DATABASE_URL found. Running dashboard in mock disconnected state.");
    }
  } catch (err) {
    console.error("Database query failed. Falling back to empty vault representation.", err);
  }

  // Compute aggregate stats across all evidence
  const scoreProfile = calculateApprovalProbability(items);

  // Take the 5 most recent uploads for the Activity feed
  const recentActivity = items.slice(0, 5).map(item => ({
    id: item.id,
    title: item.title,
    criterion: item.criterion,
    date: item.createdAt,
  }));

  return (
    <DashboardClient scoreProfile={scoreProfile} recentActivity={recentActivity} />
  );
}
