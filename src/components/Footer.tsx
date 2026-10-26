import React from 'react';
import { MapPin, Building2, Facebook, Heart, Laptop, Code2, Sparkles } from 'lucide-react';

interface FooterProps {
  facebookUrl?: string;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  facebookUrl = "https://www.facebook.com/SPIitClub01",
  onOpenAdmin
}) => {
  return (
    <footer className="bg-[#003366] text-white mt-auto border-t-4 border-[#F5B012]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          
          {/* Col 1: Club Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full border-2 border-[#F5B012] bg-white flex items-center justify-center p-0.5 shadow overflow-hidden">
                <img
                  src="./assets/aistudio/477647138_122109653414726359_696_b5f4c3a5.jpg"
                  alt="SPI IT Club Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.jpg';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#F5B012] tracking-wide">SPI IT CLUB</h3>
                <p className="text-[10px] text-slate-300 font-medium">Shariatpur Polytechnic Institute</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              The official technology community for Computer Science and Technology (CST) students at Shariatpur Polytechnic Institute.
            </p>
            <p className="text-xs text-[#F5B012] italic font-bold tracking-wide">
              &ldquo;Learn, Collaborate &amp; Innovate&rdquo;
            </p>
            <div className="mt-4">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] bg-white/10 hover:bg-white/20 text-[#F5B012] px-3 py-1.5 rounded-lg border border-white/10 transition cursor-pointer font-semibold"
              >
                Admin Login
              </button>
            </div>
          </div>

          {/* Col 2: Location & Contact */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#F5B012]" />
              <span>Campus &amp; Location</span>
            </h4>
            <ul className="text-slate-300 text-sm space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F5B012] shrink-0 mt-1" />
                <span>Burir hat, Shariatpur Sadar, Shariatpur, 8000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#F5B012] shrink-0 mt-1" />
                <span>Computer Department (Dept. CST)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Facebook className="w-4 h-4 text-[#F5B012] shrink-0 mt-1" />
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5B012] transition-colors hover:underline"
                >
                  facebook.com/SPIitClub01
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer Recognition */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#00A896]" />
              <span>Developer Credits</span>
            </h4>
            <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-inner">
              <p className="text-xs text-slate-300">Website Design &amp; Full-Stack Engineering:</p>
              <p className="text-lg font-black text-[#F5B012] mt-1 tracking-wide">Sourov Saha</p>
              <p className="text-xs text-slate-200 mt-0.5">Session: 2021-22</p>
              <p className="text-xs text-emerald-300 mt-1 font-medium">Computer Science and Technology (CST)</p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2025-2026 SPI IT Club. All Rights Reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>by Dept. of CST • Shariatpur Polytechnic Institute</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
