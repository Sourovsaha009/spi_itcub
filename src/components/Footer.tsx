import React from 'react';
import { MapPin, Building2, Facebook, Heart, Code2 } from 'lucide-react';

interface FooterProps {
  facebookUrl?: string;
}

export const Footer: React.FC<FooterProps> = ({
  facebookUrl = "https://www.facebook.com/SPIitClub01"
}) => {
  return (
    <footer className="bg-[#003366] text-white mt-auto border-t-[4px] border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          
          {/* Col 1: Club Brand Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-13 h-13 rounded-xl border-2 border-black bg-white flex items-center justify-center p-1 shadow-[3px_3px_0px_0px_#FFE600] overflow-hidden">
                <img
                  src="./assets/aistudio/477647138_122109653414726359_696_b5f4c3a5.jpg"
                  alt="SPI IT Club Logo"
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.jpg';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#FFE600] tracking-wide">SPI IT CLUB</h3>
                <p className="text-[11px] text-slate-300 font-bold">Shariatpur Polytechnic Institute</p>
              </div>
            </div>
            <p className="text-slate-200 text-sm mb-4 leading-relaxed font-medium">
              The premier technology community for Computer Science and Technology (CST) students at Shariatpur Polytechnic Institute.
            </p>
            <p className="text-xs text-[#FFE600] font-black tracking-wide uppercase">
              &ldquo;Learn, Collaborate &amp; Innovate&rdquo;
            </p>
          </div>

          {/* Col 2: Location & Contact */}
          <div>
            <h4 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Building2 className="w-4 h-4 text-[#FFE600]" />
              <span>Campus &amp; Location</span>
            </h4>
            <ul className="text-slate-200 text-sm space-y-3 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFE600] shrink-0 mt-1" />
                <span>Burir hat, Shariatpur Sadar, Shariatpur, 8000</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-[#FFE600] shrink-0 mt-1" />
                <span>Computer Department (Dept. CST)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Facebook className="w-4 h-4 text-[#FFE600] shrink-0 mt-1" />
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFE600] transition-colors hover:underline font-bold"
                >
                  facebook.com/SPIitClub01
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Developer Recognition */}
          <div>
            <h4 className="text-base font-black text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Code2 className="w-4 h-4 text-[#10B981]" />
              <span>Developer Credits</span>
            </h4>
            <div className="neo-box bg-[#FFFDF7] text-black p-5 rounded-xl">
              <p className="text-xs text-slate-700 font-bold">Website Design &amp; Full-Stack Engineering:</p>
              <p className="text-xl font-black text-[#003366] mt-1 tracking-tight">Sourov Saha</p>
              <p className="text-xs text-slate-800 mt-0.5 font-bold">Session: 2021-22</p>
              <div className="mt-2 inline-block neo-badge bg-[#FFE600] text-black text-[11px] font-black">
                Computer Science &amp; Technology (CST)
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-white/20 mt-10 pt-6 text-center text-xs text-slate-300 flex flex-col sm:flex-row justify-between items-center gap-3 font-semibold">
          <p>
            <a href="#admin1" className="hover:text-[#FFE600] transition-colors">
              © 2025-2026 SPI IT Club. All Rights Reserved.
            </a>
          </p>
          <p className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-[#FF5A5F] fill-current" />
            <span>by Dept. of CST • Shariatpur Polytechnic Institute</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
