import Link from "next/link";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicLinktreeNotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-900 px-4 py-12 text-center text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
        <Link2 className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        This link in bio page does not exist or has been temporarily unpublished by the administrator.
      </p>
      <Link href="https://vitamin2001.in" className="mt-6">
        <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
          Return to Vitamin
        </Button>
      </Link>
    </main>
  );
}
