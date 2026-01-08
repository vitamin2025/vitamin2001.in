import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-[Inter] text-[#56565C] p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-[#EDEDF0]">
        <h1 className="text-3xl font-[Poppins] font-light text-[#2D2D31] mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-justify">
          <p>Your privacy is important to us. This Privacy Policy describes how vitamin2001.in collects, uses, and discloses your information.</p>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">1. Information Collection</h2>
            <p>We collect information that you provide directly to us when you request our services, including your name, email address, phone number, and project requirements. We may also collect technical data such as IP addresses and browser information for analytical purposes.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">2. Use of Information</h2>
            <p>The information we collect is used to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Communicate with you regarding your projects and requests.</li>
              <li>Process payments and prevent fraud.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">3. Disclosure of Information</h2>
            <p>We do not sell your personal information. We may disclose your information to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Service providers who assist us in our operations (e.g., payment processors like Stripe).</li>
              <li>Legal authorities if required by law or to protect our rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">4. Security Practices</h2>
            <p>We implement industry-standard security measures to safeguard your information from unauthorized access, disclosure, or destruction. This includes encryption, secure servers, and regular security reviews.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal information. Please contact us at the details provided on our Contact Us page to exercise these rights.</p>
          </section>

          <p className="mt-8 text-xs text-[#97979B]">Last Updated: January 08, 2026</p>
        </div>
      </div>
    </div>
  );
}
