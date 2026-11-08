import React from 'react';
import { CommitteeMember } from '../types';
import { Users, Facebook, Linkedin, Github, Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import { formatWhatsAppLink } from '../utils/whatsapp';

interface CommitteeSectionProps {
  committee: CommitteeMember[];
  onSelectMember?: (member: CommitteeMember) => void;
}

export const CommitteeSection: React.FC<CommitteeSectionProps> = ({ committee, onSelectMember }) => {
  return (
    <section id="committee" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 neo-badge bg-[#10B981] text-black text-xs font-black uppercase mb-3">
          <Users className="w-3.5 h-3.5 stroke-[3]" />
          <span>Leadership &amp; Executive Team</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
          Current Executive Committee
        </h2>
        <div className="w-20 h-1.5 bg-black mx-auto mt-2 mb-3"></div>
        <p className="text-slate-700 font-medium mt-2 max-w-2xl mx-auto text-sm sm:text-base">
          Dedicated student leaders steering the club's initiatives, technical workshops, competitions, and student community forward.
        </p>
      </div>

      {committee.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-black max-w-md mx-auto p-6">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <p className="text-black font-black text-base">Executive Committee under formation</p>
          <p className="text-slate-500 text-xs mt-1">
            Committee members and panel assignments can be configured from the Admin Portal (#adminsrv1).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[...committee]
            .sort((a, b) => {
              const orderA = typeof a.order === 'number' ? a.order : Infinity;
              const orderB = typeof b.order === 'number' ? b.order : Infinity;
              if (orderA !== Infinity || orderB !== Infinity) {
                if (orderA !== orderB) return orderA - orderB;
              }
              return 0;
            })
            .map((member) => {
              const hasSocials =
                member.socials && Object.values(member.socials).some((v) => v && v.trim().length > 0);

              return (
                <div
                  key={member.id}
                  onClick={() => onSelectMember?.(member)}
                  className="neo-card bg-white p-6 sm:p-7 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                  title={`Click to connect with ${member.name}`}
                >
                  <div>
                    {/* Top Header: Role Pill & Department */}
                    <div className="flex items-center justify-between gap-2 mb-5">
                      <span className="neo-badge bg-[#FFE600] text-black text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
                        {member.role || 'Executive Member'}
                      </span>
                      <span className="neo-badge bg-[#FFFDF7] text-black text-[10px] font-mono font-bold border border-black">
                        {member.dept || 'CST'}
                      </span>
                    </div>

                    {/* Avatar Photo Frame or Tie Icon */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
                      {member.photoUrl ? (
                        <div className="w-full h-full rounded-2xl border-[3px] border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000] group-hover:shadow-[5px_5px_0px_#FFE600] transition-all duration-200">
                          <img
                            src={member.photoUrl}
                            alt={member.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-[#FFFDF7] text-black rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border-[3px] border-black shadow-[4px_4px_0px_#000] group-hover:bg-[#FFE600] transition-colors duration-200">
                          <i className="fa-solid fa-user-tie"></i>
                        </div>
                      )}
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-black rounded-full shadow-[1px_1px_0px_#000]"
                        title="Active Executive"
                      ></span>
                    </div>

                    {/* Member Name */}
                    <h4 className="font-black text-black text-xl sm:text-2xl mb-1 text-center group-hover:text-[#003366] transition-colors leading-snug">
                      {member.name}
                    </h4>

                    {/* Session info */}
                    <p className="text-slate-600 text-xs font-bold text-center mb-3">
                      {member.session || 'Session 2021-22'}
                    </p>

                    {/* Bio / Quote if provided */}
                    {member.bio && (
                      <div className="my-3 p-3 bg-[#FFFDF7] rounded-xl border-2 border-dashed border-black text-xs text-slate-800 font-medium leading-relaxed text-center whitespace-pre-wrap break-words">
                        &ldquo;{member.bio}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Social Handles, WhatsApp & Connect Button */}
                  <div className="mt-5 pt-4 border-t-2 border-black">
                    {hasSocials ? (
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                        {/* WhatsApp Button */}
                        {member.socials?.whatsapp && (
                          <a
                            href={formatWhatsAppLink(member.socials.whatsapp, member.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-[#25D366] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                            title={`Chat on WhatsApp: ${member.socials.whatsapp}`}
                          >
                            <i className="fa-brands fa-whatsapp text-lg"></i>
                          </a>
                        )}

                        {/* Facebook */}
                        {member.socials?.facebook && (
                          <a
                            href={
                              member.socials.facebook.startsWith('http')
                                ? member.socials.facebook
                                : `https://${member.socials.facebook}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-[#1877F2] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                            title="Facebook Profile"
                          >
                            <Facebook className="w-4 h-4 fill-current" />
                          </a>
                        )}

                        {/* LinkedIn */}
                        {member.socials?.linkedin && (
                          <a
                            href={
                              member.socials.linkedin.startsWith('http')
                                ? member.socials.linkedin
                                : `https://${member.socials.linkedin}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-[#0A66C2] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                            title="LinkedIn Profile"
                          >
                            <Linkedin className="w-4 h-4 fill-current" />
                          </a>
                        )}

                        {/* GitHub */}
                        {member.socials?.github && (
                          <a
                            href={
                              member.socials.github.startsWith('http')
                                ? member.socials.github
                                : `https://${member.socials.github}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-black hover:bg-[#FFE600] hover:text-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                            title="GitHub Profile"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}

                        {/* Email */}
                        {member.socials?.email && (
                          <a
                            href={`mailto:${member.socials.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-[#EA4335] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                            title={`Email: ${member.socials.email}`}
                          >
                            <Mail className="w-4 h-4 stroke-[2.5]" />
                          </a>
                        )}

                        {/* Phone */}
                        {member.socials?.phone && (
                          <a
                            href={`tel:${member.socials.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-[#10B981] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                            title={`Call: ${member.socials.phone}`}
                          >
                            <Phone className="w-4 h-4 stroke-[2.5]" />
                          </a>
                        )}

                        {/* Website */}
                        {member.socials?.website && (
                          <a
                            href={
                              member.socials.website.startsWith('http')
                                ? member.socials.website
                                : `https://${member.socials.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 rounded-lg bg-[#FFE600] hover:bg-black hover:text-white text-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                            title="Portfolio / Website"
                          >
                            <Globe className="w-4 h-4 stroke-[2.5]" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <span className="neo-badge bg-[#FFFDF7] text-slate-700 text-[10px] font-bold">
                          Executive Member • {member.dept || 'CST'}
                        </span>
                      </div>
                    )}

                    {/* DEDICATED "CONNECT WITH MEMBER" BUTTON */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMember?.(member);
                      }}
                      className="w-full neo-btn bg-[#FFE600] hover:bg-black text-black hover:text-[#FFE600] font-black text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer transition-all duration-150"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      <span>Connect with {member.name.split(' ')[0] || member.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
};
