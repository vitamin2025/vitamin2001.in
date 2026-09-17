export default function PublicLinktreeLoading() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 px-4 py-12">
      <div className="mx-auto flex w-full max-w-120 flex-col items-center space-y-8 animate-pulse">
        {/* Avatar skeleton */}
        <div className="h-24 w-24 rounded-full bg-slate-800" />

        {/* Title & bio skeleton */}
        <div className="flex flex-col items-center space-y-2.5 w-full">
          <div className="h-6 w-48 rounded-md bg-slate-800" />
          <div className="h-4 w-72 rounded-md bg-slate-800/60" />
        </div>

        {/* Link buttons skeleton */}
        <div className="flex w-full flex-col gap-3.5">
          <div className="h-14 w-full rounded-full bg-slate-800" />
          <div className="h-14 w-full rounded-full bg-slate-800" />
          <div className="h-14 w-full rounded-full bg-slate-800" />
        </div>

        {/* Social icons skeleton */}
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-full bg-slate-800" />
          <div className="h-10 w-10 rounded-full bg-slate-800" />
          <div className="h-10 w-10 rounded-full bg-slate-800" />
        </div>
      </div>
    </main>
  );
}
