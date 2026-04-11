export default function OrbLogo({ size = 80 }: { size?: number }) {
  return (
    <div
      className="relative rounded-full flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {/* Main orb */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 30%, #60A5FA 0%, #2563EB 40%, #1E40AF 70%, #1E3A8A 100%)',
          boxShadow: `0 ${size * 0.1}px ${size * 0.4}px rgba(37,99,235,0.4), inset 0 -${size * 0.05}px ${size * 0.15}px rgba(0,0,0,0.3), inset 0 ${size * 0.05}px ${size * 0.1}px rgba(255,255,255,0.15)`,
        }}
      />
      {/* Specular highlight */}
      <div
        className="absolute rounded-full"
        style={{
          top: '12%',
          left: '20%',
          width: '40%',
          height: '30%',
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          filter: 'blur(1px)',
        }}
      />
    </div>
  );
}
