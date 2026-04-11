export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0A0A0B] border-r border-[#2A2A2E] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle background pattern instead of green gradients */}
        <div className="absolute inset-0 z-0 pointer-events-none" 
             style={{
               backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
               backgroundSize: '24px 24px',
             }} />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <span className="text-[#0A0A0B] font-bold text-xs">H</span>
            </div>
            <span className="label-uppercase text-white/80">
              HappyWay
            </span>
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="font-display italic text-5xl xl:text-6xl leading-[1.1] mb-6 font-bold text-white tracking-tight">
            Prove your<br />
            extraordinary<br />
            ability.
          </h1>
          <p className="text-base font-light text-white/60 max-w-md leading-[1.7]">
            The platform built for O-1A and EB-1 aspirants to organize evidence, 
            track progress, and connect with a community of extraordinary professionals.
          </p>
        </div>
        <p className="text-xs text-white/40 relative z-10 tracking-wide">
          © {new Date().getFullYear()} HappyWay. All rights reserved.
        </p>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--bg)]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
