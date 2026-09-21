import React from "react";
import type { Metadata } from "next";
import { PolicyLayout } from "@/components/common/policy-layout";

export const metadata: Metadata = {
  title: "Terms and Conditions | vitamin2001.in",
  description:
    "Terms and Conditions governing the use of vitamin2001.in IT services, custom software development, and SaaS platforms.",
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms & Conditions">
      <p>
        These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you
        (whether individually or on behalf of an entity, &quot;Client&quot; or &quot;User&quot;) and{" "}
        <strong>Md Rushd Al Amin</strong>, doing business as <strong>vitamin2001.in</strong> (&quot;we&quot;,
        &quot;us&quot;, or &quot;our&quot;), regarding your access to and use of <strong>vitamin2001.in</strong>,
        its subdomains, client portals, and related IT development services.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">1. Business Category & Service Description</h2>
        <p>
          We operate as an <strong>IT Services & Software Development</strong> provider. Our offerings include:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Custom web application architecture, UI/UX engineering, and frontend development.</li>
          <li>Full-stack development, server APIs, and relational database modeling.</li>
          <li>Multi-tenant cloud Software-as-a-Service (SaaS) platform provisioning.</li>
          <li>Ongoing maintenance, support, and technical consulting contracts.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">2. Eligibility & Account Responsibilities</h2>
        <p>
          By accessing our site or contracting our services, you represent and warrant that you are at least
          18 years of age and hold the legal authority to bind your organization to these Terms. You are
          responsible for safeguarding any client admin credentials and immediately notifying us of any
          unauthorized account activity.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">3. Quotations, Pricing & Payment Terms</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Custom Quotations:</strong> Pricing for custom software development projects is established
            via individual Statements of Work (SOW) or custom quotes agreed upon in writing.
          </li>
          <li>
            <strong>Accepted Currencies:</strong> We invoice and process payments in Indian Rupees (INR ₹)
            for domestic clients and United States Dollars (USD $) for international engagements.
          </li>
          <li>
            <strong>Payment Gateway (PayU):</strong> All electronic payments and credit/debit card transactions
            are processed through our secure authorized payment gateway partner, <strong>PayU</strong>. You agree
            to provide accurate and complete billing details.
          </li>
          <li>
            <strong>Taxes:</strong> All fees are exclusive of applicable statutory Goods and Services Tax (GST)
            or withholding taxes unless explicitly stated otherwise on the invoice.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">4. Intellectual Property Rights</h2>
        <p>
          Unless otherwise agreed in a separate written master services agreement:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Custom software deliverables specifically commissioned and fully paid for by the Client shall become
            the intellectual property of the Client upon complete payment settlement.
          </li>
          <li>
            Underlying pre-existing frameworks, core SaaS multi-tenant boilerplate, proprietary libraries, and
            platform architecture remain the exclusive intellectual property of Md Rushd Al Amin (vitamin2001.in).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">5. Prohibited Uses</h2>
        <p>You agree not to use our platforms or custom deliverables to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Violate any applicable national, state, or international laws or regulations.</li>
          <li>Transmit malicious code, viruses, spyware, or harmful payloads.</li>
          <li>Attempt unauthorized penetration testing, reverse-engineering, or denial of service attacks.</li>
          <li>Engage in deceptive, defamatory, fraudulent, or infringing activities.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">6. Service Level, Disclaimer & Limitation of Liability</h2>
        <p>
          Our services and SaaS platforms are provided on an &quot;as is&quot; and &quot;as available&quot;
          basis. While we maintain high security and uptime standards, we do not warrant that service will be
          completely uninterrupted or error-free.
        </p>
        <p>
          To the fullest extent permitted by Indian law, Md Rushd Al Amin shall not be liable for indirect,
          punitive, incidental, or consequential damages resulting from lost profits, service interruptions, or
          data loss. Our total liability under any claim arising out of these Terms shall not exceed the total amount
          paid by the Client in the three (3) months preceding the claim.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">7. Governing Law & Jurisdiction</h2>
        <p>
          These Terms and any dispute or claim arising out of or in connection with them shall be governed
          by and construed in accordance with the laws of <strong>India</strong>. The courts situated in{" "}
          <strong>Berhampore, Murshidabad, West Bengal, India</strong> shall have exclusive jurisdiction over
          any legal proceeding arising hereunder.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">8. Contact Us</h2>
        <p>
          If you have questions regarding these Terms & Conditions, please contact:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm space-y-1">
          <p><strong>Entity Name:</strong> Md Rushd Al Amin</p>
          <p><strong>Brand / Portal:</strong> vitamin2001.in</p>
          <p><strong>Address:</strong> 134/1 Abdus Samad Road, Berhampore, WB - 742101, India</p>
          <p><strong>Email:</strong> <a href="mailto:contact@vitamin2001.in" className="text-blue-600 hover:underline">contact@vitamin2001.in</a></p>
        </div>
      </section>
    </PolicyLayout>
  );
}
