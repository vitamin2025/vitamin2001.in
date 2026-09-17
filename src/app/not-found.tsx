import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
        404 - Tenant or Page Not Found
      </h1>
      <p className="text-slate-600 max-w-md mb-8 text-sm">
        The requested tenant, subdomain, or page could not be located on vitamin2001.in.
      </p>
      <Link href="/">
        <Button className="gap-2">
          <Home className="w-4 h-4" /> Return to Main Portal
        </Button>
      </Link>
    </div>
  );
}
