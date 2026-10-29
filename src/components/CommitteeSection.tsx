import React from 'react';
import { CommitteeMember } from '../types';
import { Users } from 'lucide-react';

interface CommitteeSectionProps {
  committee: CommitteeMember[];
}

export const CommitteeSection: React.FC<CommitteeSectionProps> = ({ committee }) => {
  return (
    <section id="committee" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 neo-badge bg-[#10B981] text-black text-xs font-black uppercase mb-3">
          <Users className="w-3.5 h-3.5 stroke-[3]" />
          <span>Leadership</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
          Current Executive Committee
        </h2>
        <div className="w-20 h-1.5 bg-black mx-auto mt-2 mb-3"></div>
        <p className="text-slate-700 font-medium mt-2 max-w-2xl mx-auto text-sm sm:text-base">
          Dedicated student leaders steering the club's initiatives, workshops, and student engagements forward.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {committee.map((member) => (
          <div
            key={member.id}
            className="neo-card bg-white p-6 rounded-xl text-center group"
          >
            <div className="w-16 h-16 bg-[#FFFDF7] text-black rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 border-2 border-black shadow-[3px_3px_0px_#000] group-hover:bg-[#FFE600] transition-colors duration-150">
              <i className="fa-solid fa-user-tie"></i>
            </div>

            <h4 className="font-black text-black text-lg mb-1 group-hover:text-[#003366] transition-colors">
              {member.name}
            </h4>
            <p className="text-slate-700 text-xs sm:text-sm font-bold mb-3">
              {member.role}
            </p>

            <div className="mt-4 pt-3 border-t-2 border-black flex justify-center items-center gap-2">
              <span className="neo-badge bg-[#FFFDF7] text-black text-[11px] font-bold">
                {member.session}
              </span>
              <span className="neo-badge bg-[#FFE600] text-black text-[11px] font-black">
                {member.dept || 'CST'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
