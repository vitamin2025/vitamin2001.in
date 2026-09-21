import React from "react";
import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/policy-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | vitamin2001.in",
  description:
    "Privacy Policy for vitamin2001.in explaining how user and organization data is handled, stored, and protected in compliance with applicable laws.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>
        At <strong>vitamin2001.in</strong> (operated by <strong>Md Rushd Al Amin</strong>, referred to
        herein as &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we respect your privacy and are committed
        to protecting any personally identifiable information (PII) you share with us through our website
        (<strong>vitamin2001.in</strong>), client portals, and related software-as-a-service platforms.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
        <p>We may collect information in the following categories:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Contact & Account Data:</strong> When you register an account, submit an inquiry form,
            or contact us, we collect your name, email address, organization name, phone number, and any
            custom message details.
          </li>
          <li>
            <strong>Technical & Log Data:</strong> When accessing our services, our servers log device IP
            addresses, browser user agents, referring URLs, operating system metadata, and access timestamps
            for security, rate-limiting, and auditing.
          </li>
          <li>
            <strong>Subscription & Billing Metadata:</strong> When subscribing to services, we maintain
            records of subscription tiers, billing dates, transaction identifiers, and invoices.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Payment Processing & Gateway Information</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-900">
          <p className="font-semibold">Third-Party Gateway Security (PayU)</p>
          <p className="text-sm mt-1">
            All online financial transactions are processed securely through certified third-party payment
            gateways such as <strong>PayU Payments Private Limited</strong>.
          </p>
        </div>
        <p>
          We do <strong>not</strong> collect, process, or store sensitive credit card numbers, debit card
          PINs, CVV codes, or net banking credentials on our local servers. Payment transactions are executed
          directly via SSL/TLS 256-bit encrypted communication with PCI-DSS certified payment processors.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. How We Use Collected Data</h2>
        <p>Collected data is used strictly for legitimate business purposes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provisioning and maintaining your tenant subdomain, client admin consoles, and user logins.</li>
          <li>Responding to your project inquiries, quotation requests, and technical support tickets.</li>
          <li>Processing authorized subscription billings and delivering transaction receipts.</li>
          <li>Protecting our services from unauthorized access, fraud, abuse, and DDoS attacks.</li>
          <li>Complying with statutory tax, invoicing, and regulatory obligations in India.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. Data Sharing & Third-Party Disclosure</h2>
        <p>
          We do not sell, rent, trade, or monetize your personal data. We disclose data solely in these
          limited scenarios:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Payment Service Providers:</strong> Sharing transaction identifiers with payment gateways
            (such as PayU) for billing fulfillment and fraud detection.
          </li>
          <li>
            <strong>Cloud Infrastructure:</strong> Securely hosting data on encrypted cloud infrastructure
            providers (e.g. database hosts, transactional email relays like Brevo) under strict data protection terms.
          </li>
          <li>
            <strong>Legal Requirements:</strong> When mandated by court summons, law enforcement agencies, or
            competent regulatory authorities under Indian law.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">5. Cookies & Local Storage</h2>
        <p>
          We use strictly necessary functional session cookies and secure authentication tokens to verify user
          identities across client subdomains. We do not use third-party behavioral advertising cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">6. Data Retention & Security Measures</h2>
        <p>
          We enforce physical, administrative, and technical safeguards including encryption in transit (HTTPS /
          TLS), isolated multi-tenant data schemas, and restricted administrative credentials. Data is retained
          only for as long as your account remains active or as required by applicable tax retention laws.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">7. Your Rights</h2>
        <p>
          Subject to applicable local data protection regulations, you have the right to request access to,
          correction of, or deletion of your personal data stored on our systems. To submit a request, contact
          us at <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">contact@vitamin2001.in</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">8. Grievance Officer & Contact</h2>
        <p>
          In accordance with the Information Technology Act, 2000 and rules made thereunder, any privacy
          concerns or grievances should be addressed to:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
          <p><strong>Grievance Officer:</strong> Md Rushd Al Amin</p>
          <p><strong>Address:</strong> 134/1 Abdus Samad Road, Berhampore, WB - 742101, India</p>
          <p><strong>Email:</strong> <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">contact@vitamin2001.in</a></p>
        </div>
      </section>
    </PolicyLayout>
  );
}
