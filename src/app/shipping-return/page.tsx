import React from "react";
import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/policy-layout";
import { PackageX, Zap, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping and Delivery Policy | vitamin2001.in",
  description:
    "Shipping and Delivery Policy for vitamin2001.in explaining digital delivery procedures for IT services and SaaS products.",
};

export default function ShippingReturnPage() {
  return (
    <PolicyLayout title="Shipping & Delivery Policy">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-950 not-prose flex items-start gap-3">
        <PackageX className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="font-semibold text-sm">Strictly Digital Delivery (No Physical Goods)</h4>
          <p className="text-xs text-blue-800 mt-1">
            <strong>vitamin2001.in</strong> provides digital IT services, custom software engineering,
            and Software-as-a-Service (SaaS) platforms. No tangible or physical products are manufactured,
            stored, or shipped.
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Mode of Delivery</h2>
        <p>
          All deliverables, software platforms, and services contracted with <strong>Md Rushd Al Amin
          (vitamin2001.in)</strong> are delivered purely via electronic and digital channels:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>SaaS Subdomain & Portal Provisioning:</strong> Instant or scheduled activation of your
            dedicated client subdomain (e.g., <code>[your-org].vitamin2001.in</code>) with administrative
            login credentials transmitted to your registered corporate email.
          </li>
          <li>
            <strong>Digital Artifacts & Code Deliverables:</strong> Secure git repository access, code transfers,
            cloud environment deployment URLs, or download links for custom web applications.
          </li>
          <li>
            <strong>Electronic Documentation:</strong> Architecture specifications, API documentation, and
            user manuals delivered via secure email or authenticated client dashboard.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Delivery Timeframes & SLA</h2>
        <div className="space-y-3">
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              SaaS & Portal Subscriptions
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Upon successful payment confirmation via our PayU gateway, account access and subdomain
              activation details are normally dispatched within <strong>1 to 24 business hours</strong>.
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h4 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Custom Web Application Projects
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Custom software engineering projects are delivered incrementally based on milestone schedules
              defined in the mutually signed Statement of Work (SOW). Delivery dates are agreed prior to project
              kickoff.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Shipping Costs & Handling Charges</h2>
        <p>
          Because all services are provisioned digitally through cloud infrastructure,{" "}
          <strong>no shipping fees, courier charges, handling costs, or customs duties</strong> are ever
          levied on your purchase.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. Confirmation of Delivery</h2>
        <p>
          Digital delivery is formally considered fulfilled when the access credentials, live deployment URL,
          or repository access has been transmitted to your provided email address. If you do not receive
          your delivery credentials within 24 hours of successful transaction processing, please check your
          spam folder or notify our support team immediately at{" "}
          <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">contact@vitamin2001.in</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">5. Return Policy for Digital Services</h2>
        <p>
          Given the digital and consumable nature of custom web software, physical returns and return pickups
          are logically not applicable.
        </p>
        <p>
          If you encounter discrepancies, service interruptions, or unmet specifications, please consult our{" "}
          <a href="/refund" className="text-blue-600 hover:underline font-medium">Refund Policy</a>{" "}
          to review your eligibility for subscription cancellations and pro-rated refunds.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">6. Support & Inquiries</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
          <p><strong>Entity Name:</strong> Md Rushd Al Amin</p>
          <p><strong>Brand:</strong> vitamin2001.in</p>
          <p><strong>Address:</strong> 134/1 Abdus Samad Road, Berhampore, WB - 742101, India</p>
          <p><strong>Email:</strong> <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">contact@vitamin2001.in</a></p>
        </div>
      </section>
    </PolicyLayout>
  );
}
