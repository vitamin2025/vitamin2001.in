import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#EDEDF0] bg-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-[#97979B]">
          © {new Date().getFullYear()} Md Rushd Al Amin. All rights reserved.
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-xs font-medium text-[#56565C]">
          <Link href="/" className="hover:text-[#FD366E] transition-colors">Home</Link>
          <Link href="/contact" className="hover:text-[#FD366E] transition-colors">Contact Us</Link>
          <Link href="/terms" className="hover:text-[#FD366E] transition-colors">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-[#FD366E] transition-colors">Privacy Policy</Link>
          <Link href="/refund-policy" className="hover:text-[#FD366E] transition-colors">Refund Policy</Link>
        </nav>
      </div>
    </footer>
  );
}
