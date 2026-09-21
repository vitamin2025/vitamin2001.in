import React from "react";
import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/policy-layout";
import { RefreshCw, Clock, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy | vitamin2001.in",
  description:
    "Refund and Cancellation Policy for vitamin2001.in software services, subscriptions, and custom engineering.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Cancellation & Refund Policy">
      <p>
        At <strong>vitamin2001.in</strong> (operated by <strong>Md Rushd Al Amin</strong>), we strive to
        ensure total client satisfaction with our software platforms and IT engineering services. This
        Cancellation & Refund Policy outlines the conditions under which refunds and subscription cancellations
        are granted.
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">1. SaaS Subscription Refund Policy</h2>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-950 not-prose space-y-2">
          <div className="flex items-center gap-2 font-bold text-base text-emerald-900">
            <RefreshCw className="w-5 h-5 text-emerald-700" />
            <span>7-Day Pro-Rated Refund Guarantee</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            If you are not satisfied with your subscription-based SaaS portal or platform plan, you are
            eligible to request a <strong>pro-rated refund within the first seven (7) calendar days</strong> of
            your initial subscription purchase or account activation.
          </p>
        </div>

        <p>
          The refundable amount is computed on a pro-rata basis for the unused portion of the billing period,
          less any third-party transaction or processing fees incurred by the payment gateway.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Non-Refundable Circumstances</h2>
        <p>Refunds will not be issued under the following circumstances:</p>
        <ul className="space-y-2 list-none p-0">
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
            <span>
              <strong>Beyond 7 Days:</strong> Refund requests submitted more than 7 days after the original
              subscription activation date.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
            <span>
              <strong>Custom Milestone Work:</strong> Custom software development work and milestone payments
              that have already been completed, delivered, and formally approved by the Client in accordance with
              the Statement of Work (SOW).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-rose-500 mt-1 shrink-0" />
            <span>
              <strong>Terms Violation:</strong> Accounts suspended or terminated due to violation of our Terms
              and Conditions or acceptable use policies.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Subscription Cancellation Process</h2>
        <p>
          Clients may cancel their recurring subscriptions at any time:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            To cancel future renewals, send an email request to{" "}
            <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">
              contact@vitamin2001.in
            </a>{" "}
            at least <strong>48 hours</strong> prior to your next recurring billing date.
          </li>
          <li>
            Upon cancellation, your services and tenant subdomain will remain active until the end of the
            current paid billing cycle, after which no further recurring charges will be incurred.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. How to Request a Refund</h2>
        <p>To initiate a refund request:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Send an email to{" "}
            <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline font-medium">
              contact@vitamin2001.in
            </a>{" "}
            with the subject line: <code>[Refund Request] - [Your Organization Name]</code>.
          </li>
          <li>Include your transaction reference ID, invoice number, and registered corporate email.</li>
          <li>Briefly describe the reason for your cancellation request to help us improve our service.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">5. Refund Processing Timeline & Method</h2>
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2 text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>5 to 7 Business Days Settlement</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Once approved, your refund will be processed through our authorized payment gateway (<strong>PayU</strong>).
            The funds will automatically be credited back to the <strong>original payment method</strong> (e.g., credit card,
            debit card, UPI, or net banking account) within <strong>5 to 7 working business days</strong>, subject to your issuing bank&apos;s settlement schedule.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">6. Merchant Contact for Refund Disputes</h2>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
          <p><strong>Merchant Name:</strong> Md Rushd Al Amin</p>
          <p><strong>Brand / Domain:</strong> vitamin2001.in</p>
          <p><strong>Address:</strong> 134/1 Abdus Samad Road, Berhampore, WB - 742101, India</p>
          <p><strong>Email:</strong> <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">contact@vitamin2001.in</a></p>
        </div>
      </section>
    </PolicyLayout>
  );
}
