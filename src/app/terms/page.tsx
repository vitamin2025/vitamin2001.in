import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-[Inter] text-[#56565C] p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-[#EDEDF0]">
        <h1 className="text-3xl font-[Poppins] font-light text-[#2D2D31] mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-justify">
          <p>Welcome to vitamin2001.in. By using our website and services, you agree to comply with and be bound by the following terms and conditions.</p>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">1. Services Provided</h2>
            <p>We provide software development services, including web application development and related services, to clients.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">2. User Obligations</h2>
            <p>Users agree to provide accurate information and use our services for lawful purposes only.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">3. Intellectual Property</h2>
            <p>All content, designs, and code provided as part of the service remain our property until full payment is received, unless otherwise specified in the contract.</p>
          </section>

          <section id="cancellation-policy">
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">4. Cancellation Policy</h2>
            <p>Cancellation is available until the order or service goes into "in process" status. Once the work on the order begins, no cancellation will be accepted as these services require significant effort and resources. Changes to requirements can be requested and will be handled according to the specific contract terms.</p>
          </section>

          <section id="refund-policy">
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">5. Refund Policy</h2>
            <p>Once the service or order has moved to "in process" status, no refunds will be issued. We invest significant time and effort into building your applications from the start of the project. If you wish to cancel before the process has started, a refund may be processed minus any applicable transaction fees.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">6. Limitation of Liability</h2>
            <p>We shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">7. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Murshidabad, West Bengal.</p>
          </section>

          <p className="mt-8 text-xs text-[#97979B]">Last Updated: January 08, 2026</p>
        </div>
      </div>
    </div>
  );
}
