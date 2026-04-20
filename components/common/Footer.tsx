import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaMapPin, FaPhone, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 font-sans">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="space-y-5">
            <Image src="/saifurs.svg" width={64} height={64} alt="Saifurs Publications" />

            <div className="flex gap-4 pt-2">
              <Link href="https://www.facebook.com/SaifursPublications" target='_blank' className="bg-gray-800 p-2 rounded hover:bg-[#1877F2] hover:text-white transition"><FaFacebook size={20} /></Link>
              <Link href="https://www.youtube.com/@SaifursPublications" target="_blank" className="bg-gray-800 p-2 rounded hover:bg-[#FF0000] hover:text-white transition"><FaYoutube size={20} /></Link>
              <Link href="https://www.instagram.com/saifurs.com.bd/" target="_blank" className="bg-gray-800 p-2 rounded hover:bg-[#E4405F] hover:text-white transition"><FaInstagram size={20} /></Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-4">প্রয়োজনীয় লিঙ্ক</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products?filter=spoken" className="hover:text-red-500 transition">স্পোকেন ইংলিশ</Link></li>
                <li><Link href="/products?filter=ielts" className="hover:text-red-500 transition">আইইলটিএস</Link></li>
                <li><Link href="/products?filter=academic" className="hover:text-red-500 transition">একাডেমিক</Link></li>
                <li><Link href="/products?filter=jobs" className="hover:text-red-500 transition">জব&apos;স</Link></li>
                <li><Link href="/authors" className="hover:text-red-500 transition">লেখক</Link></li>
              </ul>
            </div>

          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h4 className="text-white font-semibold mb-4">হটলাইন</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FaPhone className="text-red-500" size={20} />
                <div>
                  <p className="text-white font-bold text-lg">09647222000</p>
                  <p className="text-xs text-gray-500">সকাল ৯টা - রাত ৮টা</p>
                </div>
              </div>

              <div className="h-px bg-gray-700 my-2"></div>

              <div className="flex items-start gap-3 text-sm">
                <FaMapPin className="text-red-500 mt-0.5" size={18} />
                <p>18 Joy Chandra Ghosh Lane, Paridash Road, Moyej Uddin Red Crescent Matrisadan Hospital, Banglabazar, Dhaka</p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© 2026 Saifurs Publications Ltd | All Right Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;