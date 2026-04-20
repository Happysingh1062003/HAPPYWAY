export default function DashboardLoading() {
  return (
    <div className="p-8 w-full max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 bg-[var(--bg-muted)] border border-[var(--border)] rounded w-1/4"></div>
        <div className="h-8 bg-[var(--bg-muted)] border border-[var(--border)] rounded w-24"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-32 bg-[var(--bg-muted)] border border-[var(--border)] rounded-xl col-span-2"></div>
        <div className="h-32 bg-[var(--bg-muted)] border border-[var(--border)] rounded-xl"></div>
      </div>
      <div className="h-64 bg-[var(--bg-muted)] border border-[var(--border)] rounded-xl"></div>
    </div>
  );
}
