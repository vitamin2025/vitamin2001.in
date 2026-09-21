import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  category?: string;
  children: React.ReactNode;
}

export function PolicyLayout({
  title,
  lastUpdated = "September 21, 2026",
  category = "IT Services & Software Development",
  children,
}: PolicyLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
            <span>vitamin2001<span className="text-blue-600">.in</span></span>
          </Link>

          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 md:p-12">
          {/* Header info */}
          <div className="border-b border-slate-200 pb-8 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Last Updated: {lastUpdated} &bull; Entity: Md Rushd Al Amin (operating as vitamin2001.in)
            </p>
          </div>

          {/* Policy Body */}
          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
            {children}
          </div>

          {/* Legal / Contact Info Box */}
          <div className="mt-12 pt-8 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 md:-mx-12 md:-mb-12 p-6 sm:p-8 rounded-b-2xl">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Merchant & Legal Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Legal Business Name:</p>
                <p>Md Rushd Al Amin (Individual Proprietorship)</p>
                <p className="mt-2 font-semibold text-slate-900">Trade Name / Brand:</p>
                <p>vitamin2001.in</p>
                <p className="mt-2 font-semibold text-slate-900">Business Category:</p>
                <p>IT Services & Software Development</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  Registered Business Address:
                </p>
                <p className="mt-0.5 whitespace-pre-line">
                  134/1 Abdus Samad Road, Berhampore{"\n"}
                  WB - 742101, India
                </p>

                <p className="mt-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  Official Contact Email:
                </p>
                <p className="mt-0.5">
                  <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">
                    contact@vitamin2001.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto space-y-3">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-slate-600">
            <Link href="/about" className="hover:text-blue-600">About Us</Link>
            <Link href="/privacy-policy" className="hover:text-blue-600">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600">Terms & Conditions</Link>
            <Link href="/shipping-return" className="hover:text-blue-600">Shipping & Delivery</Link>
            <Link href="/refund" className="hover:text-blue-600">Refund Policy</Link>
            <Link href="/#contact" className="hover:text-blue-600">Contact Us</Link>
          </div>
          <p>
            &copy; {new Date().getFullYear()} vitamin2001.in. All rights reserved. Registered under Md Rushd Al Amin.
          </p>
        </div>
      </footer>
    </div>
  );
}
