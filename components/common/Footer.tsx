import React from 'react';
import { Facebook, Youtube, Instagram, Phone, MapPin, Mail, Clock } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 font-sans">
      <div className="max-w-[1224px] mx-auto px-4 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="space-y-5">
            <Image src="/saifurs.svg" width={64} height={64} alt="Saifurs Publications" />

            <div className="flex gap-4 pt-2">
              <a href="#" className="bg-gray-800 p-2 rounded hover:bg-[#1877F2] hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded hover:bg-[#FF0000] hover:text-white transition"><Youtube size={20} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded hover:bg-[#E4405F] hover:text-white transition"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-white font-semibold mb-4">বইসমূহ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-red-500 transition">Spoken English</a></li>
                <li><a href="#" className="hover:text-red-500 transition">IELTS Books</a></li>
                <li><a href="#" className="hover:text-red-500 transition">BCS Preliminary</a></li>
                <li><a href="#" className="hover:text-red-500 transition">Bank Job</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">কোম্পানি</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-red-500 transition">আমাদের সম্পর্কে</a></li>
                <li><a href="#" className="hover:text-red-500 transition">ক্যারিয়ার</a></li>
                <li><a href="#" className="hover:text-red-500 transition">যোগাযোগ</a></li>
                <li><a href="#" className="hover:text-red-500 transition">Terms & Condition</a></li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
            <h4 className="text-white font-semibold mb-4">হটলাইন</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-red-500" size={20} />
                <div>
                  <p className="text-white font-bold text-lg">01613-432043</p>
                  <p className="text-xs text-gray-500">সকাল ১০টা - রাত ৮টা</p>
                </div>
              </div>

              <div className="h-px bg-gray-700 my-2"></div>

              <div className="flex items-start gap-3 text-sm">
                <MapPin className="text-red-500 mt-0.5" size={18} />
                <p>লেভেল-৫, অর্কিড প্লাজা, <br />ধানমন্ডি, ঢাকা-১২০৫</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>© 2026 Saifurs Publications Ltd | All Right Reserved</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;