'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const addEvidenceSchema = z.object({
  title: z.string().min(1),
  criterion: z.string().min(1),
  description: z.string(),
  organization: z.string(),
  date: z.string(),
  url: z.string(),
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
