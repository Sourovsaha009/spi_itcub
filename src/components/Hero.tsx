import React from 'react';
import { Facebook, Sparkles, UserPlus, ArrowRight, Terminal, BookOpen, Layers, Cpu, Code2, Wifi } from 'lucide-react';

interface HeroProps {
  onOpenJoin: () => void;
  facebookUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ onOpenJoin, facebookUrl = "https://www.facebook.com/SPIitClub01" }) => {
  return (
    <div>
      {/* Neo-Brutalist High-Energy Ticker / Marquee */}
      <div className="bg-[#FFE600] border-b-[3px] border-black overflow-hidden py-2 font-black text-xs sm:text-sm tracking-wider uppercase select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-6">
          <span>⚡ SPI IT CLUB</span>
          <span>•</span>
          <span>ESTABLISHED 2025</span>
          <span>•</span>
          <span>COMPUTER SCIENCE &amp; TECHNOLOGY (DEPT. CST)</span>
          <span>•</span>
          <span>LEARN, COLLABORATE &amp; INNOVATE</span>
          <span>•</span>
          <span>PROGRAMMING • NETWORKING • HARDWARE • CYBER SECURITY</span>
          <span>•</span>
          <span>SHARIATPUR POLYTECHNIC INSTITUTE</span>
          <span>•</span>
          <span>⚡ SPI IT CLUB</span>
          <span>•</span>
          <span>ESTABLISHED 2025</span>
          <span>•</span>
          <span>COMPUTER SCIENCE &amp; TECHNOLOGY (DEPT. CST)</span>
          <span>•</span>
          <span>LEARN, COLLABORATE &amp; INNOVATE</span>
          <span>•</span>
          <span>PROGRAMMING • NETWORKING • HARDWARE • CYBER SECURITY</span>
          <span>•</span>
          <span>SHARIATPUR POLYTECHNIC INSTITUTE</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-[#003366] text-white py-14 sm:py-20 px-4 relative overflow-hidden border-b-[3px] border-black">
        {/* Decorative Neo Grid & Cyber Matrix Background */}
        <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none"></div>
        <div className="absolute inset-0 bg-neo-dots opacity-15 pointer-events-none"></div>

        {/* Floating Tech Chips (Desktop) */}
        <div className="hidden lg:block absolute left-8 top-28 animate-float-slow pointer-events-none z-10">
          <div className="neo-box bg-black text-[#FFE600] text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[4px_4px_0px_#FFE600]">
            <Code2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>const SPI = &#123; est: 2025, dept: 'CST' &#125;;</span>
          </div>
        </div>

        <div className="hidden lg:block absolute right-8 top-32 animate-float-reverse pointer-events-none z-10">
          <div className="neo-box bg-white text-black text-xs font-mono font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[4px_4px_0px_#000]">
            <Wifi className="w-3.5 h-3.5 text-[#003366]" />
            <span>NET: 10.0.0.1 // 1000Mbps OK</span>
          </div>
        </div>

        <div className="hidden xl:block absolute left-12 bottom-20 animate-float-reverse pointer-events-none z-10">
          <div className="neo-box bg-[#10B981] text-black text-xs font-mono font-black px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[3px_3px_0px_#000]">
            <Cpu className="w-3.5 h-3.5" />
            <span>SYS_CORE: CST_STUDENTS</span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Live System Status Indicator */}
          <div className="inline-flex items-center gap-2.5 bg-black/80 border-2 border-[#FFE600] px-3.5 py-1 rounded-full text-xs font-mono text-[#FFE600] mb-5 shadow-[3px_3px_0px_#000]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]"></span>
            </span>
            <span className="font-bold tracking-wider">SYSTEM STATUS: ACTIVE ONLINE</span>
          </div>

          {/* Official SPI IT Club Emblem Badge with Interactive Tilt */}
          <div className="flex justify-center mb-6">
            <div className="relative group inline-block">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-[3px] border-black bg-white p-1.5 shadow-[6px_6px_0px_0px_#000] group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:rotate-2 group-hover:shadow-[8px_8px_0px_0px_#FFE600] transition-all duration-200">
                <img
                  src="./assets/aistudio/477647138_122109653414726359_696_b5f4c3a5.jpg"
                  alt="SPI IT Club Official Emblem"
                  className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-[#FFE600] text-black text-[11px] font-black px-2 py-0.5 rounded border-2 border-black shadow-[2px_2px_0px_0px_#000] group-hover:scale-110 transition-transform">
                DEPT-CST
              </span>
            </div>
          </div>

          {/* CST Department Tag in Neo-Brutalist Pill */}
          <div className="inline-flex items-center gap-2 bg-white text-black border-2 border-black text-xs sm:text-sm px-4 py-1.5 rounded-lg font-black mb-6 shadow-[3px_3px_0px_0px_#FFE600] hover:-translate-y-0.5 transition-transform">
            <Sparkles className="w-4 h-4 text-[#003366]" />
            <span>Computer Department (Dept. CST) • Established 2025</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight sm:leading-tight mb-4 tracking-tight uppercase text-white drop-shadow-[2px_2px_0px_#000]">
            JOIN US TODAY &amp; BE A PART OF{' '}
            <span className="bg-[#FFE600] text-black px-2 py-0.5 border-2 border-black shadow-[4px_4px_0px_0px_#000] inline-block my-1 hover:rotate-1 transition-transform">
              SOMETHING EXTRAORDINARY!
            </span>
          </h1>

          {/* Motto / Slogan */}
          <p className="text-[#FFE600] text-xl sm:text-2xl md:text-3xl font-black mb-6 tracking-wide drop-shadow-[2px_2px_0px_#000]">
            &ldquo;Learn, Collaborate &amp; Innovate&rdquo;
          </p>

          {/* Description requested by user */}
          <div className="bg-white/10 backdrop-blur-xs border-2 border-white/20 p-5 rounded-2xl max-w-3xl mx-auto mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] hover:border-[#FFE600] transition-colors duration-200">
            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-semibold">
              Established in 2025 by passionate Computer Department students of Shariatpur Polytechnic Institute. Joining the SPI IT Club empowers you with programming, networking and communicating skills.
            </p>
          </div>

          {/* Action Buttons with Fluid Micro-Interactions */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={onOpenJoin}
              className="neo-btn bg-[#FFE600] text-black font-black px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer text-sm sm:text-base group"
            >
              <UserPlus className="w-5 h-5 stroke-[2.5]" />
              <span>Apply For Membership</span>
              <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1.5 transition-transform duration-150" />
            </button>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn bg-[#2563EB] text-white font-black px-6 py-3.5 rounded-xl flex items-center gap-2 text-sm sm:text-base group"
            >
              <Facebook className="w-5 h-5 fill-current group-hover:scale-110 transition-transform duration-150" />
              <span>Visit Facebook Page</span>
            </a>

            <a
              href="#courses"
              className="neo-btn bg-white text-black font-black px-6 py-3.5 rounded-xl flex items-center gap-2 text-sm sm:text-base group"
            >
              <Terminal className="w-5 h-5 text-[#003366] stroke-[2.5] group-hover:rotate-12 transition-transform duration-150" />
              <span>Explore Courses</span>
            </a>
          </div>

          {/* Neo-Brutalist Stats Strip with Hover Elevation */}
          <div className="mt-12 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div className="neo-box bg-white text-black p-4 rounded-xl group hover:-translate-y-1 transition-all duration-150">
              <div className="text-2xl sm:text-3xl font-black text-[#003366] group-hover:scale-105 transition-transform">2025</div>
              <div className="text-xs font-black uppercase text-slate-600 mt-1">Established</div>
            </div>
            <div className="neo-box bg-[#FFE600] text-black p-4 rounded-xl group hover:-translate-y-1 transition-all duration-150">
              <div className="text-2xl sm:text-3xl font-black text-black group-hover:scale-105 transition-transform">7+</div>
              <div className="text-xs font-black uppercase text-slate-800 mt-1">Tech Domains</div>
            </div>
            <div className="neo-box bg-white text-black p-4 rounded-xl group hover:-translate-y-1 transition-all duration-150">
              <div className="text-2xl sm:text-3xl font-black text-[#10B981] group-hover:scale-105 transition-transform">100%</div>
              <div className="text-xs font-black uppercase text-slate-600 mt-1">Practical Hands-on</div>
            </div>
            <div className="neo-box bg-[#10B981] text-black p-4 rounded-xl group hover:-translate-y-1 transition-all duration-150">
              <div className="text-2xl sm:text-3xl font-black text-black group-hover:scale-105 transition-transform">CST</div>
              <div className="text-xs font-black uppercase text-black mt-1">Student Led</div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};
