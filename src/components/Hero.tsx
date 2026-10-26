import React from 'react';
import { Code, Facebook, Sparkles, UserPlus, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenJoin: () => void;
  facebookUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ onOpenJoin, facebookUrl = "https://www.facebook.com/SPIitClub01" }) => {
  return (
    <section className="gradient-banner text-white py-16 sm:py-20 px-4 relative overflow-hidden border-b-4 border-[#F5B012]/40">
      {/* Decorative ambient blurs */}
      <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#00A896]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-10 top-0 w-72 h-72 bg-[#F5B012]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        {/* Official SPI IT Club Emblem Badge */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#F5B012] shadow-2xl overflow-hidden bg-white p-1 group-hover:scale-105 transition-transform duration-300">
              <img
                src="./assets/aistudio/477647138_122109653414726359_696_b5f4c3a5.jpg"
                alt="SPI IT Club Official Emblem"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
            </div>
            <span className="absolute -bottom-1 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-white shadow">
              DEPT-CST
            </span>
          </div>
        </div>

        {/* CST Department Tag */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-[#F5B012] border border-[#F5B012]/30 text-xs sm:text-sm px-4 py-1.5 rounded-full font-semibold mb-6 shadow-inner animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Computer Department (Dept. CST) • Established 2025</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight sm:leading-tight mb-4 tracking-tight uppercase">
          JOIN US TODAY & BE A PART OF <span className="text-[#F5B012] drop-shadow-sm">SOMETHING EXTRAORDINARY!</span>
        </h1>

        {/* Motto / Slogan */}
        <p className="text-[#F5B012] text-xl sm:text-2xl md:text-3xl font-extrabold mb-6 tracking-wide drop-shadow">
          &ldquo;Learn, Collaborate &amp; Innovate&rdquo;
        </p>

        {/* Description requested by user */}
        <p className="text-slate-200 max-w-3xl mx-auto text-base sm:text-lg mb-8 leading-relaxed font-normal">
          Established in 2025 by passionate Computer Department students of Shariatpur Polytechnic Institute. Joining the SPI IT Club empowers you with programming, networking and communicating skills.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4">
          <button
            onClick={onOpenJoin}
            className="bg-[#F5B012] hover:bg-amber-400 text-[#003366] font-extrabold px-6 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer text-sm sm:text-base"
          >
            <UserPlus className="w-5 h-5" />
            <span>Apply For Membership</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm sm:text-base"
          >
            <Facebook className="w-5 h-5 fill-current" />
            <span>Visit Facebook Page</span>
          </a>

          <a
            href="#courses"
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm sm:text-base"
          >
            <Code className="w-5 h-5 text-[#00A896]" />
            <span>Explore Courses</span>
          </a>
        </div>

        {/* Quick Highlights Counter */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-center">
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-[#F5B012]">2025</div>
            <div className="text-xs text-slate-300 font-medium uppercase mt-0.5">Established</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-[#00A896]">7+</div>
            <div className="text-xs text-slate-300 font-medium uppercase mt-0.5">Tech Domains</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-[#F5B012]">100%</div>
            <div className="text-xs text-slate-300 font-medium uppercase mt-0.5">Practical Hands-on</div>
          </div>
          <div className="p-2">
            <div className="text-2xl sm:text-3xl font-black text-[#00A896]">CST</div>
            <div className="text-xs text-slate-300 font-medium uppercase mt-0.5">Student Led</div>
          </div>
        </div>

      </div>
    </section>
  );
};
