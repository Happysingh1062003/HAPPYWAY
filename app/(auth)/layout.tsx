import Link from 'next/link';
import OrbLogo from '@/components/landing/OrbLogo';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="dark" className="relative min-h-[100dvh] flex flex-col items-center overflow-x-hidden px-4 md:px-6 bg-[#000000]">
      {/* Back to Home */}
      <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium z-50">
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back to Home</span>
      </Link>

      <style>{`
        .input-field {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          border-radius: 12px !important;
          padding: 0.875rem 1.125rem !important;
          font-size: 1rem !important;
          font-family: var(--font-body), sans-serif !important;
          color: white !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) inset !important;
        }
        .input-field:hover {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
        .input-field:focus {
          border-color: rgba(255, 255, 255, 0.3) !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 4px rgba(255, 255, 255, 0.05) !important;
          outline: none !important;
        }
        label {
          font-family: var(--font-body), sans-serif !important;
          color: rgba(255, 255, 255, 0.9) !important;
          font-size: 0.875rem !important;
        }
        button[type="submit"], button:not([variant="secondary"]) {
          background-color: #FFFFFF !important;
          color: #000000 !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
        }
        button[type="submit"]:hover, button:not([variant="secondary"]):hover {
          background-color: rgba(255, 255, 255, 0.85) !important;
        }
      `}</style>
      
      <div className="flex-1 flex flex-col justify-center w-full max-w-[380px] mx-auto animate-fade-in-up py-12">
        
        {/* Minimal Header */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="hover:opacity-80 transition-opacity flex flex-col items-center gap-3">
            <OrbLogo size={42} />
            <span className="text-white/80 text-[10px] font-semibold tracking-[0.2em] uppercase">HappyWay</span>
          </Link>
        </div>
        
        {/* Uncontained Form Content */}
        <div className="w-full text-white">
          {children}
        </div>

      </div>
      
      {/* Footer Branding */}
      <div className="w-full pb-6 flex justify-center z-10 text-white/20 text-[10px] uppercase tracking-[0.2em]">
        <span>© {new Date().getFullYear()} HappyWay</span>
      </div>
    </div>
  );
}
