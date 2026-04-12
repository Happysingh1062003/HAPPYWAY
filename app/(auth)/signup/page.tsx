'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';

import { FIELD_LABELS, VISA_LABELS } from '@/lib/utils';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bangladesh','Belarus','Belgium','Bolivia','Brazil','Bulgaria','Cambodia','Cameroon','Canada',
  'Chile','China','Colombia','Costa Rica','Croatia','Cuba','Czech Republic','Denmark',
  'Dominican Republic','Ecuador','Egypt','El Salvador','Estonia','Ethiopia','Finland','France',
  'Georgia','Germany','Ghana','Greece','Guatemala','Haiti','Honduras','Hong Kong','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan',
  'Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Latvia','Lebanon','Libya','Lithuania',
  'Luxembourg','Malaysia','Mexico','Moldova','Mongolia','Morocco','Myanmar','Nepal','Netherlands',
  'New Zealand','Nicaragua','Nigeria','North Korea','Norway','Oman','Pakistan','Palestine',
  'Panama','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia',
  'Saudi Arabia','Senegal','Serbia','Singapore','Slovakia','Slovenia','South Africa','South Korea',
  'Spain','Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania',
  'Thailand','Tunisia','Turkey','Turkmenistan','Uganda','Ukraine','United Arab Emirates',
  'United Kingdom','United States','Uruguay','Uzbekistan','Venezuela','Vietnam','Yemen','Zimbabwe'
];

// Build base schema by merging step schemas
// Note: We duplicate field definitions here instead of using .merge() with step1Schema
// because step1Schema uses .refine() which converts it to ZodEffects and breaks .merge().
// We also avoid .default() here since useForm's defaultValues handles initial values,
// and .default() creates input/output type mismatches with zodResolver.
const signupBaseSchema = z.object({
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
  field: z.enum(['ai_ml', 'biotech', 'finance', 'law', 'medicine', 'arts', 'engineering', 'research', 'entrepreneurship', 'other']),
  currentRole: z.string().min(1, 'Current role is required').max(100),
  currentOrganization: z.string().min(1, 'Organization is required').max(100),
  nationality: z.string().min(1, 'Nationality is required'),
  targetVisa: z.enum(['o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure']),
  isApprovedHolder: z.boolean(),
  approvedVisaType: z.enum(['o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure']).optional(),
  approvedYear: z.number().min(2000).max(2030).optional(),
  displayName: z.string().min(1, 'Display name is required').max(50),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional(),
  linkedinUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  googleScholarUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isPublic: z.boolean(),
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: 'Passwords do not match', path: ['confirmPassword'] }
);

type SignupFormValues = z.infer<typeof signupBaseSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupBaseSchema),
    mode: 'onTouched',
    defaultValues: {
      isApprovedHolder: false,
      isPublic: false,
    }
  });

  const isApprovedHolder = watch('isApprovedHolder');
  const isPublic = watch('isPublic');
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email', 'password', 'confirmPassword']);
      if (isValid) {
        const valDisplayName = watch('displayName');
        if (!valDisplayName) setValue('displayName', `${firstName} ${lastName}`);
      }
    } else if (step === 2) {
      isValid = await trigger(['field', 'currentRole', 'currentOrganization', 'nationality', 'targetVisa', 'isApprovedHolder', 'approvedVisaType', 'approvedYear']);
    } else if (step === 3) {
      isValid = await trigger(['displayName', 'bio', 'linkedinUrl', 'googleScholarUrl', 'githubUrl', 'isPublic']);
    }

    if (isValid && step < 4) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      console.log('Submission Payload', data);
      await new Promise(r => setTimeout(r, 1500));
      toast.success('Account created! Please check your email to verify.');
      router.push('/login');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldOptions = Object.entries(FIELD_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const visaOptions = Object.entries(VISA_LABELS).map(([v, l]) => ({ value: v, label: l }));
  const countryOptions = COUNTRIES.map(c => ({ value: c, label: c }));
  const yearOptions = Array.from({ length: 30 }, (_, i) => {
    const y = new Date().getFullYear() - i;
    return { value: y.toString(), label: y.toString() };
  });

  return (
    <div className="animate-fade-in-up">
      {/* Mobile branding */}
      <div className="lg:hidden mb-6 text-center">
        <span className="text-xs font-medium tracking-[0.2em] uppercase text-white/40">
          HappyWay
        </span>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all duration-300
              ${s < step ? 'bg-white text-black' :
                s === step ? 'bg-white text-black' :
                'bg-white/5 text-white/40'}
            `}>
              {s < step ? <Check className="w-3.5 h-3.5" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-8 h-0.5 transition-colors duration-300 ${s < step ? 'bg-white' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1 — Credentials */}
        {step === 1 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="mb-6">
              <h1 className="text-4xl mb-3 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>Create your account</h1>
              <p className="text-base text-white/50 font-normal">Let&apos;s start with your login credentials</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="First name" {...register('firstName')} error={errors.firstName?.message} placeholder="John" />
              <Input label="Last name" {...register('lastName')} error={errors.lastName?.message} placeholder="Doe" />
            </div>
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="john@example.com" />
            <Input label="Password" type="password" {...register('password')} error={errors.password?.message} hint="Min 8 chars, uppercase, number, and special character" />
            <Input label="Confirm password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
          </div>
        )}

        {/* Step 2 — Professional Identity */}
        {step === 2 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="mb-6">
              <h1 className="text-4xl mb-3 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>Professional identity</h1>
              <p className="text-base text-white/50 font-normal">Tell us about your expertise and visa goals</p>
            </div>
            <Select label="Field of expertise" {...register('field')} options={fieldOptions} placeholder="Select your field" error={errors.field?.message} />
            <Input label="Current role / title" {...register('currentRole')} error={errors.currentRole?.message} placeholder="Senior Research Scientist" />
            <Input label="Current organization" {...register('currentOrganization')} error={errors.currentOrganization?.message} placeholder="MIT" />
            <Select label="Country of citizenship" {...register('nationality')} options={countryOptions} placeholder="Select country" error={errors.nationality?.message} />
            <Select label="Target visa type" {...register('targetVisa')} options={visaOptions} placeholder="Select visa type" error={errors.targetVisa?.message} />

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-sm font-medium text-white">Already an approved visa holder?</p>
                <p className="text-xs text-white/40">Share your success and earn on the marketplace</p>
              </div>
              <button
                type="button"
                onClick={() => setValue('isApprovedHolder', !isApprovedHolder)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isApprovedHolder ? 'bg-blue-500' : 'bg-white/20'}`}
                role="switch"
                aria-checked={isApprovedHolder}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${isApprovedHolder ? 'translate-x-5' : ''}`} />
              </button>
            </div>

            {isApprovedHolder && (
              <div className="space-y-3 pt-4 border-t border-white/10 animate-fade-in-up">
                <Select label="Approved visa type" {...register('approvedVisaType')} options={visaOptions} placeholder="Select type" error={errors.approvedVisaType?.message} />
                <Select label="Year approved" {...register('approvedYear', { setValueAs: (v) => v ? parseInt(v) : undefined })} options={yearOptions} placeholder="Select year" error={errors.approvedYear?.message} />
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Profile Setup */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="mb-6">
              <h1 className="text-4xl mb-3 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>Set up your profile</h1>
              <p className="text-base text-white/50 font-normal">How you&apos;ll appear to others on the platform</p>
            </div>
            <Input label="Display name" {...register('displayName')} error={errors.displayName?.message} />
            <Textarea label="Short bio" {...register('bio')} error={errors.bio?.message} maxChars={300} placeholder="Tell us a bit about your work and accomplishments..." />
            <Input label="LinkedIn URL" {...register('linkedinUrl')} error={errors.linkedinUrl?.message} placeholder="https://linkedin.com/in/..." />
            <Input label="Google Scholar URL" {...register('googleScholarUrl')} error={errors.googleScholarUrl?.message} placeholder="https://scholar.google.com/..." />
            <Input label="GitHub URL" {...register('githubUrl')} error={errors.githubUrl?.message} placeholder="https://github.com/..." />

            <div className="flex items-center justify-between py-3 border-b border-white/10 mt-6">
              <div>
                <p className="text-sm font-medium text-white">Make profile public</p>
                <p className="text-xs text-white/40">Public profiles appear in the collaboration network</p>
              </div>
              <button
                type="button"
                onClick={() => setValue('isPublic', !isPublic)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isPublic ? 'bg-blue-500' : 'bg-white/20'}`}
                role="switch"
                aria-checked={isPublic}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${isPublic ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Confirmation */}
        {step === 4 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="mb-6">
              <h1 className="text-4xl mb-3 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>Confirm your details</h1>
              <p className="text-base text-white/50 font-normal">Review everything before we create your account</p>
            </div>

            <div className="border-b border-white/10 py-3 space-y-2">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Account</h3>
              <p className="text-sm text-white"><span className="text-white/50">Name:</span> {firstName} {lastName}</p>
              <p className="text-sm text-white"><span className="text-white/50">Email:</span> {watch('email')}</p>
            </div>

            <div className="border-b border-white/10 py-3 space-y-2">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Professional</h3>
              <p className="text-sm text-white"><span className="text-white/50">Field:</span> {FIELD_LABELS[watch('field')] || watch('field')}</p>
              <p className="text-sm text-white"><span className="text-white/50">Role:</span> {watch('currentRole')}</p>
              <p className="text-sm text-white"><span className="text-white/50">Organization:</span> {watch('currentOrganization')}</p>
              <p className="text-sm text-white"><span className="text-white/50">Target Visa:</span> {VISA_LABELS[watch('targetVisa')] || watch('targetVisa')}</p>
              <p className="text-sm text-white"><span className="text-white/50">Citizenship:</span> {watch('nationality')}</p>
            </div>

            <div className="border-b border-white/10 py-3 space-y-2">
              <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider">Profile</h3>
              <p className="text-sm text-white"><span className="text-white/50">Display name:</span> {watch('displayName')}</p>
              {watch('bio') && <p className="text-sm text-white"><span className="text-white/50">Bio:</span> {watch('bio')}</p>}
              <p className="text-sm text-white"><span className="text-white/50">Visibility:</span> {isPublic ? 'Public' : 'Private'}</p>
            </div>

            <div className="p-4 border-l-2 border-white/40 text-white/60 text-sm">
              We&apos;ll send a verification email to <strong className="text-white">{watch('email')}</strong>. Please verify before logging in.
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button type="button" variant="secondary" onClick={prevStep} className="flex-1">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button type="button" onClick={nextStep} className="flex-1">
              Continue
            </Button>
          ) : (
            <Button type="submit" loading={loading} className="flex-1" size="lg">
              Create account
            </Button>
          )}
        </div>
      </form>

      {step === 1 && (
        <p className="mt-6 text-center text-sm text-white/60 font-light">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-semibold hover:underline underline-offset-4 transition-colors">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
