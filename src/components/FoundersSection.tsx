import React from 'react';
import { FounderItem } from '../types';
import { Award, Sparkles } from 'lucide-react';

interface FoundersSectionProps {
  founders: FounderItem[];
}

export const FoundersSection: React.FC<FoundersSectionProps> = ({ founders }) => {
  return (
    <section id="founders" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A896] bg-[#00A896]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Award className="w-3.5 h-3.5 text-[#00A896]" />
          <span>Roots &amp; Heritage</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#003366] tracking-tight">
          Founder Panel
        </h2>
        <div className="w-20 h-1.5 bg-[#00A896] mx-auto rounded-full mt-3"></div>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          The visionaries and mentors who laid the cornerstone of SPI IT Club in 2025.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {founders.map((founder) => (
          <div
            key={founder.id}
            className="group relative bg-gradient-to-br from-[#003366] via-[#0A192F] to-[#002244] text-white p-8 rounded-3xl shadow-xl border border-[#F5B012]/30 text-center hover:border-[#F5B012] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5B012]/5 rounded-bl-full pointer-events-none group-hover:scale-125 transition-transform"></div>

            <div className="w-20 h-20 bg-[#F5B012]/15 border-2 border-[#F5B012] text-[#F5B012] rounded-full flex items-center justify-center text-3xl mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <i className={`fa-solid ${founder.icon || 'fa-users-gear'}`}></i>
            </div>

            <h3 className="font-extrabold text-2xl text-white mb-1.5 tracking-wide">
              {founder.name}
            </h3>
            
            <p className="text-[#F5B012] text-sm sm:text-base font-bold tracking-wide">
              {founder.role}
            </p>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
              <span className="inline-block bg-white/10 text-xs px-3.5 py-1 rounded-full text-slate-200 font-medium">
                {founder.session}
              </span>
              {founder.dept && (
                <span className="inline-block bg-[#00A896]/30 text-emerald-300 border border-emerald-400/30 text-xs px-3 py-1 rounded-full font-medium">
                  {founder.dept}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
