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
  field: z.enum(['ai_ml', 'biotech', 'finance', 'law', 'medicine', 'arts', 'engineering', 'research', 'entrepreneurship', 'other']),
  nationality: z.string().min(1, 'Nationality is required'),
  targetVisa: z.enum(['o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure']),
  linkedinUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  isApprovedHolder: z.boolean(),
  approvedVisaType: z.enum(['o1a', 'o1b', 'eb1a', 'eb1b', 'eb2_niw', 'not_sure']).optional(),
  approvedYear: z.number().min(2000).max(2030).optional(),
  isPublic: z.boolean(),
});

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

  const nextStep = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email', 'password']);
    } else if (step === 2) {
      isValid = await trigger(['field', 'nationality', 'targetVisa', 'linkedinUrl']);
    }

    if (isValid && step < 3) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      console.log('Submission Payload:', data);
      await new Promise(r => setTimeout(r, 1500));
      setStep(4);
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
      {step < 4 && (
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-medium transition-all duration-300
                ${s < step ? 'bg-white text-black' :
                  s === step ? 'bg-white text-black' :
                  'bg-white/5 text-white/40'}
              `}>
                {s < step ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-12 h-0.5 transition-colors duration-300 ${s < step ? 'bg-white' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={(e) => {
        if (step < 3) {
          e.preventDefault();
          nextStep();
        } else {
          handleSubmit(onSubmit)(e);
        }
      }}>
        {/* Step 1 — Credentials */}
        {step === 1 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="mb-8">
              <h1 className="text-4xl mb-3 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>Create your account</h1>
              <p className="text-base text-white/50 font-normal">Let&apos;s start with your basics.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <Input label="First name" {...register('firstName')} error={errors.firstName?.message} placeholder="Alan" />
               <Input label="Last name" {...register('lastName')} error={errors.lastName?.message} placeholder="Turing" />
            </div>
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="alan@example.com" />
            <Input label="Password" type="password" {...register('password')} error={errors.password?.message} hint="Min 8 chars, uppercase, number, and special character" />
          </div>
        )}

        {/* Step 2 — Professional Identity */}
        {step === 2 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="mb-8">
              <h1 className="text-4xl mb-3 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>Your goals</h1>
              <p className="text-base text-white/50 font-normal">Tell us about your visa journey.</p>
            </div>
            <Select label="Target visa type" {...register('targetVisa')} options={visaOptions} placeholder="Select visa type" error={errors.targetVisa?.message} />
            <Select label="Field of expertise" {...register('field')} options={fieldOptions} placeholder="Select your field" error={errors.field?.message} />
            <Select label="Country of citizenship" {...register('nationality')} options={countryOptions} placeholder="Select country" error={errors.nationality?.message} />
            <Input label="LinkedIn URL (Optional)" {...register('linkedinUrl')} error={errors.linkedinUrl?.message} placeholder="https://linkedin.com/in/..." />
          </div>
        )}

        {/* Step 3 — Network Intent & Submit */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-4">
            <div className="mb-8">
              <h1 className="text-4xl mb-3 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>Community</h1>
              <p className="text-base text-white/50 font-normal">Your success powers the network.</p>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div>
                <p className="text-sm font-medium text-white">Already an approved visa holder?</p>
                <p className="text-xs text-white/40">Share your success and earn on the marketplace</p>
              </div>
              <button
                type="button"
                onClick={() => setValue('isApprovedHolder', !isApprovedHolder)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isApprovedHolder ? 'bg-white' : 'bg-white/10'}`}
                role="switch"
                aria-checked={isApprovedHolder}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ${isApprovedHolder ? 'translate-x-5 bg-black' : 'bg-white/50'}`} />
              </button>
            </div>

            {isApprovedHolder && (
              <div className="space-y-3 pt-4 border-t border-white/10 animate-fade-in-up">
                <Select label="Approved visa type" {...register('approvedVisaType')} options={visaOptions} placeholder="Select type" error={errors.approvedVisaType?.message} />
                <Select label="Year approved" {...register('approvedYear', { setValueAs: (v) => v ? parseInt(v) : undefined })} options={yearOptions} placeholder="Select year" error={errors.approvedYear?.message} />
              </div>
            )}

            <div className="flex items-center justify-between py-3 border-b border-white/10 mt-6">
              <div>
                <p className="text-sm font-medium text-white">Make profile public</p>
                <p className="text-xs text-white/40">Connect with others navigating the O-1/EB-1 process</p>
              </div>
              <button
                type="button"
                onClick={() => setValue('isPublic', !isPublic)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isPublic ? 'bg-white' : 'bg-white/10'}`}
                role="switch"
                aria-checked={isPublic}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform duration-200 ${isPublic ? 'translate-x-5 bg-black' : 'bg-white/50'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div className="animate-fade-in-up space-y-6 text-center py-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <Check className="w-8 h-8 text-black" />
            </div>
            <div className="mb-10">
              <h1 className="text-4xl mb-4 font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-body), sans-serif' }}>You&apos;re all set!</h1>
              <p className="text-base text-white/50 font-normal">Your account has been created successfully.</p>
            </div>
            <Button type="button" onClick={() => router.push('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex gap-3 mt-10">
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={prevStep} className="flex-1 bg-transparent border-white/10 hover:bg-white/5 text-white transition-all shadow-none">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep} className="flex-1">
                Continue
              </Button>
            ) : (
              <Button type="submit" loading={loading} className="flex-1">
                Create account
              </Button>
            )}
          </div>
        )}
      </form>

      {step === 1 && (
        <p className="mt-8 text-center text-sm text-white/50 font-light">
          Already have an account?{' '}
          <Link href="/login" className="text-white font-medium hover:underline underline-offset-4 transition-colors">
            Sign in
          </Link>
        </p>
      )}
    </div>
  );
}
