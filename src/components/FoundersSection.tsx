import React from 'react';
import { FounderItem } from '../types';
import { Award, Facebook, Linkedin, Github, Mail, Phone, Globe, ExternalLink } from 'lucide-react';
import { formatWhatsAppLink } from '../utils/whatsapp';

interface FoundersSectionProps {
  founders: FounderItem[];
  onSelectMember?: (founder: FounderItem) => void;
}

export const FoundersSection: React.FC<FoundersSectionProps> = ({ founders, onSelectMember }) => {
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
        {[...founders]
          .sort((a, b) => {
            const orderA = typeof a.order === 'number' ? a.order : Infinity;
            const orderB = typeof b.order === 'number' ? b.order : Infinity;
            if (orderA !== Infinity || orderB !== Infinity) {
              if (orderA !== orderB) return orderA - orderB;
            }
            return 0;
          })
          .map((founder) => {
            const hasSocials =
              founder.socials && Object.values(founder.socials).some((v) => v && v.trim().length > 0);

            return (
              <div
                key={founder.id}
                onClick={() => onSelectMember?.(founder)}
                className="neo-card bg-[#003366] text-white p-7 sm:p-8 rounded-2xl text-center relative overflow-hidden group flex flex-col justify-between cursor-pointer"
                title={`Click to connect with ${founder.name}`}
              >
                <div>
                  {/* Photo Avatar or Icon */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4">
                    {founder.photoUrl ? (
                      <div className="w-full h-full rounded-2xl border-[3px] border-black bg-white overflow-hidden shadow-[5px_5px_0px_0px_#FFE600] group-hover:-translate-y-1 transition-all duration-200">
                        <img
                          src={founder.photoUrl}
                          alt={founder.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-[#FFE600] border-[3px] border-black text-black rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-[5px_5px_0px_0px_#000] group-hover:-translate-y-1 transition-transform duration-150">
                        <i className={`fa-solid ${founder.icon || 'fa-users-gear'}`}></i>
                      </div>
                    )}
                  </div>

                  <h3 className="font-black text-2xl text-white mb-1 tracking-tight">
                    {founder.name}
                  </h3>

                  <p className="text-[#FFE600] text-sm sm:text-base font-black tracking-wide mb-3">
                    {founder.role}
                  </p>

                  {/* Bio / Quote if provided */}
                  {founder.bio && (
                    <div className="my-3 p-3 bg-white/10 rounded-xl border border-white/20 text-xs text-slate-200 font-medium leading-relaxed text-center whitespace-pre-wrap break-words">
                      &ldquo;{founder.bio}&rdquo;
                    </div>
                  )}
                </div>

                <div>
                  {/* Badges */}
                  <div className="mt-4 pt-4 border-t-2 border-white/20 flex items-center justify-center gap-2">
                    <span className="neo-badge bg-white text-black text-xs font-black">
                      {founder.session}
                    </span>
                    {founder.dept && (
                      <span className="neo-badge bg-[#10B981] text-black text-xs font-black">
                        {founder.dept}
                      </span>
                    )}
                  </div>

                  {/* Social Handles if available */}
                  {hasSocials && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {/* WhatsApp Button */}
                      {founder.socials?.whatsapp && (
                        <a
                          href={formatWhatsAppLink(founder.socials.whatsapp, founder.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-lg bg-[#25D366] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                          title={`Chat on WhatsApp: ${founder.socials.whatsapp}`}
                        >
                          <i className="fa-brands fa-whatsapp text-lg"></i>
                        </a>
                      )}

                      {/* Facebook */}
                      {founder.socials?.facebook && (
                        <a
                          href={
                            founder.socials.facebook.startsWith('http')
                              ? founder.socials.facebook
                              : `https://${founder.socials.facebook}`
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
                      {founder.socials?.linkedin && (
                        <a
                          href={
                            founder.socials.linkedin.startsWith('http')
                              ? founder.socials.linkedin
                              : `https://${founder.socials.linkedin}`
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
                      {founder.socials?.github && (
                        <a
                          href={
                            founder.socials.github.startsWith('http')
                              ? founder.socials.github
                              : `https://${founder.socials.github}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-lg bg-black hover:bg-[#FFE600] hover:text-black text-white flex items-center justify-center border-2 border-white shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                          title="GitHub Profile"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}

                      {/* Email */}
                      {founder.socials?.email && (
                        <a
                          href={`mailto:${founder.socials.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-lg bg-[#EA4335] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                          title={`Email: ${founder.socials.email}`}
                        >
                          <Mail className="w-4 h-4 stroke-[2.5]" />
                        </a>
                      )}

                      {/* Phone */}
                      {founder.socials?.phone && (
                        <a
                          href={`tel:${founder.socials.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-lg bg-[#10B981] hover:bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                          title={`Call: ${founder.socials.phone}`}
                        >
                          <Phone className="w-4 h-4 stroke-[2.5]" />
                        </a>
                      )}

                      {/* Website */}
                      {founder.socials?.website && (
                        <a
                          href={
                            founder.socials.website.startsWith('http')
                              ? founder.socials.website
                              : `https://${founder.socials.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-lg bg-[#FFE600] hover:bg-black hover:text-white text-black flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_#000] hover:translate-y-0.5 transition-all"
                          title="Website / Portfolio"
                        >
                          <Globe className="w-4 h-4 stroke-[2.5]" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* DEDICATED "CONNECT WITH FOUNDER" BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectMember?.(founder);
                    }}
                    className="w-full neo-btn bg-[#FFE600] hover:bg-white text-black font-black text-xs sm:text-sm py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer mt-4 transition-all duration-150"
                  >
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                    <span>Connect with {founder.name.split(' ')[0] || founder.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};
