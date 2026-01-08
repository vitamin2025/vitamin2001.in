import React from 'react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-[Inter] text-[#56565C] p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-[#EDEDF0]">
        <h1 className="text-3xl font-[Poppins] font-light text-[#2D2D31] mb-6">Contact Us</h1>
        
        <div className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-[#2D2D31] mb-2">Get in Touch</h2>
            <p>If you have any questions about our services or need support, please reach out to us using the details below.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#2D2D31] mb-2">Registered Address</h2>
            <p><strong>Md Rushd Al Amin</strong></p>
            <p>134/1 Abdus Samad Road,</p>
            <p>Berhampore, Murshidabad,</p>
            <p>West Bengal - 742101, India</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#2D2D31] mb-2">Phone Number</h2>
            <p>+91 - 7601801620</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#2D2D31] mb-2">Support Hours</h2>
            <p>Monday - Friday: 10:00 AM - 6:00 PM (IST)</p>
          </section>
        </div>
      </div>
    </div>
  );
}
