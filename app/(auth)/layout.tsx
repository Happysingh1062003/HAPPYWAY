export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-[var(--accent)] text-[var(--text-inverse)] flex-col justify-between p-12">
        <div>
          <span className="text-sm font-sans font-medium tracking-[0.2em] uppercase opacity-70">
            HappyWay
          </span>
        </div>
        <div>
          <h1 className="font-serif italic text-5xl xl:text-6xl leading-[1.1] mb-6">
            Prove your<br />
            extraordinary<br />
            ability.
          </h1>
          <p className="text-lg font-light opacity-70 max-w-md leading-relaxed">
            The platform built for O-1A and EB-1 aspirants to organize evidence, 
            track progress, and connect with a community of extraordinary professionals.
          </p>
        </div>
        <p className="text-xs opacity-40">
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
