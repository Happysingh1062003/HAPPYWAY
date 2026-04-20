import { Metadata } from 'next';
import VaultClient from './VaultClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { evidenceItems } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Vault | HappyWay',
  description: 'Manage your evidence and documents',
};

export default async function VaultPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;

  if (!session || !user?.id) {
    redirect('/login');
  }

  // Fetch real evidence from the database securely
  let mappedEvidence: any[] = [];
  try {
    const records = await db.select()
      .from(evidenceItems)
      .where(eq(evidenceItems.userId, user.id))
      .orderBy(desc(evidenceItems.createdAt));
      
    // Map PostgreSQL formats into VaultClient expectation format
    mappedEvidence = records.map(record => ({
      id: record.id,
      title: record.title,
      criterion: record.criterion,
      description: record.description || undefined,
      organization: record.issuingOrganization || undefined,
      date: record.dateIssued ? record.dateIssued.toISOString().split('T')[0] : undefined,
      fileType: record.fileType || null,
      fileSize: record.fileSize || null,
      externalUrl: record.externalUrl || undefined,
      strengthScore: record.strengthScore || 0,
    }));
  } catch (error) {
    console.warn('Database error (expected in offline demo mode):', error);
  }

  return <VaultClient initialEvidence={mappedEvidence} />;
}
