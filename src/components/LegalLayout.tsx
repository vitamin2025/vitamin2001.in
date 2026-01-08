import React from 'react';

interface LegalLayoutProps {
    title: string;
    children: React.ReactNode;
}

export default function LegalLayout({ title, children }: LegalLayoutProps) {
    return (
        <main className="min-h-screen bg-[#FAFAFB] py-12 px-4 sm:px-6 lg:px-8 font-[Inter]">
            <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-8 border border-[#EDEDF0]">
                <h1 className="text-3xl font-bold text-[#2D2D31] mb-8 border-b pb-4">{title}</h1>
                <div className="prose prose-slate max-w-none text-[#56565C] leading-relaxed">
                    {children}
                </div>
            </div>
            <div className="mt-8 text-center">
                <a href="/" className="text-[#FD366E] hover:underline">Back to Home</a>
            </div>
        </main>
    );
}
