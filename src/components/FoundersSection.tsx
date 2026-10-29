import React from 'react';
import { FounderItem } from '../types';
import { Award } from 'lucide-react';

interface FoundersSectionProps {
  founders: FounderItem[];
}

export const FoundersSection: React.FC<FoundersSectionProps> = ({ founders }) => {
  return (
    <section id="founders" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 neo-badge bg-[#FFE600] text-black text-xs font-black uppercase mb-3">
          <Award className="w-3.5 h-3.5 stroke-[3]" />
          <span>Roots &amp; Heritage</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
          Founder Panel
        </h2>
        <div className="w-20 h-1.5 bg-black mx-auto mt-2 mb-3"></div>
        <p className="text-slate-700 font-medium mt-2 max-w-2xl mx-auto text-sm sm:text-base">
          The visionaries and mentors who laid the cornerstone of SPI IT Club in 2025.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {founders.map((founder) => (
          <div
            key={founder.id}
            className="neo-card bg-[#003366] text-white p-8 rounded-2xl text-center relative overflow-hidden group"
          >
            {/* Top decorative badge */}
            <div className="w-20 h-20 bg-[#FFE600] border-2 border-black text-black rounded-2xl flex items-center justify-center text-3xl mx-auto mb-5 shadow-[4px_4px_0px_0px_#000] group-hover:-translate-y-1 transition-transform duration-150">
              <i className={`fa-solid ${founder.icon || 'fa-users-gear'}`}></i>
            </div>

            <h3 className="font-black text-2xl text-white mb-1.5 tracking-tight">
              {founder.name}
            </h3>
            
            <p className="text-[#FFE600] text-sm sm:text-base font-black tracking-wide">
              {founder.role}
            </p>

            <div className="mt-6 pt-5 border-t-2 border-white/20 flex items-center justify-center gap-3">
              <span className="neo-badge bg-white text-black text-xs font-black">
                {founder.session}
              </span>
              {founder.dept && (
                <span className="neo-badge bg-[#10B981] text-black text-xs font-black">
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
