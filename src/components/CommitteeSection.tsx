import React from 'react';
import { CommitteeMember } from '../types';
import { Users, UserCheck } from 'lucide-react';

interface CommitteeSectionProps {
  committee: CommitteeMember[];
}

export const CommitteeSection: React.FC<CommitteeSectionProps> = ({ committee }) => {
  return (
    <section id="committee" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#003366] bg-[#F5B012]/20 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Users className="w-3.5 h-3.5 text-[#003366]" />
          <span>Leadership</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#003366] tracking-tight">
          Current Executive Committee
        </h2>
        <div className="w-20 h-1.5 bg-[#F5B012] mx-auto rounded-full mt-3"></div>
        <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
          Dedicated student leaders steering the club's initiatives, workshops, and student engagements forward.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
        {committee.map((member) => (
          <div
            key={member.id}
            className="group bg-white p-6 rounded-2xl shadow-md border border-slate-200 text-center hover:border-[#003366] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative"
          >
            <div className="w-16 h-16 bg-slate-100 text-[#003366] rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border-2 border-slate-200 group-hover:border-[#F5B012] group-hover:bg-[#003366] group-hover:text-[#F5B012] transition-all duration-300 shadow-sm">
              <i className="fa-solid fa-user-tie"></i>
            </div>

            <h4 className="font-extrabold text-[#003366] text-lg mb-1 group-hover:text-[#00A896] transition-colors">
              {member.name}
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-3">
              {member.role}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">{member.session}</span>
              <span>•</span>
              <span className="bg-blue-50 text-[#003366] font-bold px-2.5 py-1 rounded-md">{member.dept || 'CST'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
