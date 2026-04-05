import { z } from 'zod';

export const signupStep1Schema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const signupStep2Schema = z.object({
  field: z.enum(['ai_ml', 'biotech', 'finance', 'law', 'medicine', 'arts', 'engineering', 'research', 'entrepreneurship', 'other']),
  currentRole: z.string().min(1, 'Current role is required').max(100),
  currentOrganization: z.string().min(1, 'Organization is required').max(100),
  nationality: z.string().min(1, 'Nationality is required'),
  targetVisa: z.enum(['o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure']),
  isApprovedHolder: z.boolean().default(false),
  approvedVisaType: z.enum(['o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure']).optional(),
  approvedYear: z.number().min(2000).max(2030).optional(),
});

export const signupStep3Schema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  linkedinUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  googleScholarUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isPublic: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const evidenceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  criterion: z.enum(['awards', 'membership', 'press', 'judging', 'original_contributions', 'scholarly_articles', 'critical_role', 'high_salary', 'commercial_success']),
  issuingOrganization: z.string().max(200).optional(),
  dateIssued: z.string().optional(),
  externalUrl: z.string().url().optional().or(z.literal('')),
});

export const resourceSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['document', 'link', 'blog', 'prompt', 'template', 'video', 'other']),
  externalUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).max(10).optional(),
  isPublic: z.boolean().default(false),
});

export const marketplaceListingSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(100, 'Description must be at least 100 characters').max(5000),
  documentType: z.enum(['full_petition', 'cover_letter', 'rec_letter', 'evidence_index', 'strategy_doc']),
  priceUsd: z.number().min(9, 'Minimum price is $9').max(499, 'Maximum price is $499'),
  tags: z.array(z.string()).max(10).optional(),
});

export const opportunitySchema = z.object({
  title: z.string().min(1).max(200),
  organization: z.string().min(1).max(200),
  type: z.enum(['award', 'grant', 'speaking', 'publication', 'fellowship', 'competition', 'press', 'judging_panel', 'other']),
  description: z.string().min(1).max(5000),
  eligibility: z.string().max(2000).optional(),
  fields: z.array(z.string()).optional(),
  deadline: z.string().optional(),
  applicationUrl: z.string().url('Please enter a valid URL'),
  criterionMatch: z.array(z.string()).optional(),
});

export const collaborationProfileSchema = z.object({
  headline: z.string().max(120).optional(),
  lookingFor: z.array(z.string()).optional(),
  offering: z.array(z.string()).optional(),
  skills: z.array(z.string()).max(10).optional(),
  isVisible: z.boolean().default(true),
});

export const connectRequestSchema = z.object({
  message: z.string().min(20, 'Message must be at least 20 characters').max(500),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),
  confirmPassword: z.string(),
  token: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
