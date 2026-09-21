import React from "react";
import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/policy-layout";
import { Code2, Server, Globe, Cpu, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | vitamin2001.in - IT Services & Software Development",
  description:
    "Learn about vitamin2001.in, an IT services and custom software development enterprise providing modern web applications and SaaS platforms.",
};

export default function AboutUsPage() {
  return (
    <PolicyLayout title="About Us">
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Who We Are</h2>
        <p>
          <strong>vitamin2001.in</strong> is an Indian technology enterprise founded and operated
          by individual proprietor <strong>Md Rushd Al Amin</strong>, specializing in high-performance
          web application development, multi-tenant digital platforms, and cloud-native software architecture.
        </p>
        <p>
          We partner with enterprises, growing organizations, and emerging startups to design, build,
          and deploy tailored digital solutions that accelerate business efficiency and provide seamless
          customer experiences.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Business Category & Scope</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="font-semibold text-slate-900">
            Official Business Category:{" "}
            <span className="text-blue-600">IT Services & Software Development</span>
          </p>
          <p className="text-xs text-slate-600 mt-1">
            We deliver digital technology products, custom web software, software-as-a-service (SaaS)
            instances, and ongoing technology maintenance services.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Core Services & Solutions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Custom Web Applications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tailored frontend experiences built using React, Next.js, and TypeScript, engineered for speed, responsiveness, and scale.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Full-Stack Development</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              End-to-end engineering spanning scalable backend APIs, database architecture, multi-tenant isolation, and third-party integrations.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Websites & Portals</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Secure client portals, custom internal dashboards, and branded customer-facing websites tailored to specific organizational workflows.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">SaaS Products & Platforms</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subscription-based SaaS offerings delivered via dedicated subdomain provisioning, robust authorization, and cloud hosting.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Our Commitment</h2>
        <ul className="space-y-2 list-none p-0">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
            <span>
              <strong>Transparency & Integrity:</strong> Clear contracts, transparent project timelines, and straightforward subscription models.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
            <span>
              <strong>Security & Compliance:</strong> Strict adherence to cloud data protection practices, encrypted transactions, and secure gateway processing.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
            <span>
              <strong>Dedicated Support:</strong> Direct communication channels, rapid bug resolution, and proactive system maintenance.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Operating Address & Inquiries</h2>
        <p>
          For official correspondence, billing inquiries, or technical collaboration, please contact us at:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
          <p><strong>Legal Name:</strong> Md Rushd Al Amin</p>
          <p><strong>Brand / Website:</strong> vitamin2001.in</p>
          <p><strong>Address:</strong> 134/1 Abdus Samad Road, Berhampore, WB - 742101, India</p>
          <p><strong>Email:</strong> <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">contact@vitamin2001.in</a></p>
        </div>
      </section>
    </PolicyLayout>
  );
}
