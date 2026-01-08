import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FAFAFB] font-[Inter] text-[#56565C] p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-[#EDEDF0]">
        <h1 className="text-3xl font-[Poppins] font-light text-[#2D2D31] mb-6">Cancellation & Refund Policy</h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-justify">
          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">Cancellation Policy</h2>
            <p>Cancellation is available until the order or service goes into "in process" status. Once the work on the order begins, no cancellation will be accepted as software development services require significant effort and we need compensation for the time we have spent building the application.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">Refund Policy</h2>
            <p>Once the service or order has moved to "in process" status, no refunds will be issued. We invest significant time and effort into building your applications from the start of the project. If you wish to cancel before the process has started, a refund may be processed minus any applicable transaction fees.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">Changes to Requirements</h2>
            <p>While cancellation and refunds are limited once the process has begun, changes to requirements can be done accordingly as per the specific contract or agreement established at the start of the project.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2D2D31] mb-2">Contact for Support</h2>
            <p>For any questions regarding cancellations or refunds, please reach out to us at +91 - 7601801620 or visit our Contact Us page.</p>
          </section>

          <p className="mt-8 text-xs text-[#97979B]">Last Updated: January 08, 2026</p>
        </div>
      </div>
    </div>
  );
}
