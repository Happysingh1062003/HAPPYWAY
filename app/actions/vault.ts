'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { evidenceItems, criterionEnum } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

const addEvidenceSchema = z.object({
  title: z.string().min(1),
  criterion: z.enum(criterionEnum.enumValues),
  description: z.string().optional(),
  organization: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  uploadType: z.enum(['file', 'url']),
  fileSize: z.number().nullable().optional(),
  fileType: z.string().nullable().optional(),
});

export async function addEvidenceAction(payload: z.infer<typeof addEvidenceSchema>) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;
  
  if (!session || !user?.id) {
    return { error: 'Unauthorized: Session required to perform this action.' };
  }

  const parsed = addEvidenceSchema.safeParse(payload);

  if (!parsed.success) {
    return { error: 'Please check your inputs and try again.' };
  }

  const data = parsed.data;

  try {
    await db.insert(evidenceItems).values({
      userId: user.id,
      title: data.title,
      criterion: data.criterion,
      description: data.description,
      issuingOrganization: data.organization,
      dateIssued: data.date ? new Date(data.date) : null,
      externalUrl: data.uploadType === 'url' ? data.url : null,
      strength: 'solid', // Default mapping
      strengthScore: 65, // Add matching default score
      fileType: data.fileType,
      fileSize: data.fileSize,
    });

    revalidatePath('/vault');
    return { success: true };
  } catch (error) {
    console.error('Failed to save evidence:', error);
    return { error: 'Server error while saving evidence.' };
  }
}

export async function deleteEvidenceAction(id: string) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;
  
  if (!session || !user?.id) {
    return { error: 'Unauthorized' };
  }

  try {
    // Ensure the user can only delete their own item
    await db.delete(evidenceItems).where(
      and(eq(evidenceItems.id, id), eq(evidenceItems.userId, user.id))
    );

    revalidatePath('/vault');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete evidence:', error);
    return { error: 'Failed to delete evidence.' };
  }
}
