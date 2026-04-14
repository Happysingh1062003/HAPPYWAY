'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const addEvidenceSchema = z.object({
  title: z.string().min(1),
  criterion: z.string().min(1),
  description: z.string().optional(),
  organization: z.string().optional(),
  date: z.string().optional(),
  url: z.string().optional(),
  uploadType: z.enum(['file', 'url']),
});

export async function addEvidenceAction(prevState: unknown, formData: FormData) {
  // Extract data
  const data = {
    title: formData.get('title') as string,
    criterion: formData.get('criterion') as string,
    description: formData.get('description') as string,
    organization: formData.get('organization') as string,
    date: formData.get('date') as string,
    url: formData.get('url') as string,
    uploadType: formData.get('uploadType') as 'file' | 'url',
  };

  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string } | undefined;
  
  if (!session || !user?.id) {
    return { error: 'Unauthorized: Session required to perform this action.' };
  }



  const parsed = addEvidenceSchema.safeParse(data);

  if (!parsed.success) {
    return { error: 'Please check your inputs and try again.' };
  }

  // Simulate heavy database/AI analysis task
  await new Promise(resolve => setTimeout(resolve, 1500));

  // In a real app we'd insert into db here:
  // await db.insert(evidenceItems).values(...)

  revalidatePath('/vault');
  
  return { success: true };
}
