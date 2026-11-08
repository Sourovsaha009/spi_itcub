import React, { useEffect } from 'react';
import { X, ExternalLink, Mail, Phone, Globe, Linkedin, Facebook, Github, Sparkles } from 'lucide-react';
import { CommitteeMember, FounderItem } from '../types';
import { formatWhatsAppLink, getPrimaryConnectLink } from '../utils/whatsapp';

interface MemberConnectModalProps {
  member: CommitteeMember | FounderItem | null;
  onClose: () => void;
}

export const MemberConnectModal: React.FC<MemberConnectModalProps> = ({ member, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (member) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [member, onClose]);

  if (!member) return null;

  const hasAnySocial =
    member.socials &&
    Object.values(member.socials).some((v) => typeof v === 'string' && v.trim().length > 0);

  const primaryConnect = getPrimaryConnectLink(member.socials, member.name);
  const isFounder = 'icon' in member;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FFFDF7] rounded-3xl border-3 border-black shadow-[8px_8px_0px_#000] p-6 sm:p-8 overflow-y-auto max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 rounded-xl bg-slate-100 hover:bg-[#FFE600] text-black border-2 border-black flex items-center justify-center font-black cursor-pointer shadow-[2px_2px_0px_#000] transition-colors"
          title="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Member Header */}
        <div className="flex flex-col items-center text-center mb-6">
          {/* Avatar Photo Frame */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-4">
            {member.photoUrl ? (
              <div className="w-full h-full rounded-2xl border-[3px] border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000]">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-full bg-[#FFE600] text-black rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border-[3px] border-black shadow-[4px_4px_0px_#000]">
                <i className={`fa-solid ${isFounder ? (member as FounderItem).icon || 'fa-users-gear' : 'fa-user-tie'}`}></i>
              </div>
            )}
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#10B981] border-2 border-black rounded-full shadow-[1px_1px_0px_#000]"
              title="Verified SPI IT Club Leader"
            ></span>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap justify-center">
            <span className="neo-badge bg-[#FFE600] text-black text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_#000]">
              {member.role || 'Leader'}
            </span>
            <span className="neo-badge bg-white text-black text-xs font-mono font-bold border border-black">
              {member.dept || 'CST'}
            </span>
            {member.session && (
              <span className="neo-badge bg-[#003366] text-white text-xs font-mono font-bold">
                {member.session}
              </span>
            )}
          </div>

          <h3 className="font-black text-2xl sm:text-3xl text-black tracking-tight mb-1">
            {member.name}
          </h3>

          {member.bio && (
            <div className="mt-3 p-3.5 bg-white rounded-2xl border-2 border-dashed border-black text-xs sm:text-sm text-slate-800 font-medium leading-relaxed max-w-md mx-auto whitespace-pre-wrap break-words">
              &ldquo;{member.bio}&rdquo;
            </div>
          )}
        </div>

        {/* PRIMARY "CONNECT WITH MEMBER" BUTTON */}
        <div className="mb-6">
          {primaryConnect ? (
            <a
              href={primaryConnect.url}
              target={primaryConnect.url.startsWith('mailto:') || primaryConnect.url.startsWith('tel:') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="w-full neo-btn bg-[#003366] hover:bg-[#FFE600] text-[#FFE600] hover:text-black font-black text-base sm:text-lg py-3.5 px-6 rounded-2xl flex items-center justify-center gap-3 border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-all cursor-pointer min-h-[52px]"
            >
              <i className={`${primaryConnect.icon} text-xl`}></i>
              <span>Connect with {member.name}</span>
              <ExternalLink className="w-5 h-5 stroke-[2.5]" />
            </a>
          ) : (
            <div className="w-full bg-slate-100 border-2 border-black rounded-2xl p-3 text-center text-xs font-bold text-slate-600">
              <span>Connect with {member.name}</span>
            </div>
          )}
        </div>

        {/* ALL CONTACT & SOCIAL MEDIA CHANNELS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct Social &amp; Communication Channels</span>
            </span>
          </div>

          {hasAnySocial ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              {member.socials?.whatsapp && (
                <a
                  href={formatWhatsAppLink(member.socials.whatsapp, member.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn bg-[#25D366] hover:bg-black text-white font-black text-xs sm:text-sm p-3 rounded-xl flex items-center gap-2.5 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer col-span-1 sm:col-span-2 justify-center"
                >
                  <i className="fa-brands fa-whatsapp text-xl"></i>
                  <span>Chat on WhatsApp ({member.socials.whatsapp})</span>
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
                  className="neo-btn bg-[#1877F2] hover:bg-black text-white font-bold text-xs p-2.5 rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <Facebook className="w-4 h-4 fill-current shrink-0" />
                  <span className="truncate">Facebook Profile</span>
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
                  className="neo-btn bg-[#0A66C2] hover:bg-black text-white font-bold text-xs p-2.5 rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <Linkedin className="w-4 h-4 fill-current shrink-0" />
                  <span className="truncate">LinkedIn Profile</span>
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
                  className="neo-btn bg-black hover:bg-[#FFE600] text-white hover:text-black font-bold text-xs p-2.5 rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  <span className="truncate">GitHub Profile</span>
                </a>
              )}

              {/* Direct Email */}
              {member.socials?.email && (
                <a
                  href={`mailto:${member.socials.email}`}
                  className="neo-btn bg-[#EA4335] hover:bg-black text-white font-bold text-xs p-2.5 rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <Mail className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">Email ({member.socials.email})</span>
                </a>
              )}

              {/* Phone Call */}
              {member.socials?.phone && (
                <a
                  href={`tel:${member.socials.phone}`}
                  className="neo-btn bg-[#10B981] hover:bg-black text-white font-bold text-xs p-2.5 rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <Phone className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">Call: {member.socials.phone}</span>
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
                  className="neo-btn bg-[#FFE600] hover:bg-black text-black hover:text-white font-bold text-xs p-2.5 rounded-xl flex items-center gap-2 border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer"
                >
                  <Globe className="w-4 h-4 stroke-[2.5] shrink-0" />
                  <span className="truncate">Personal Portfolio</span>
                </a>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl text-center text-xs text-slate-500 font-medium">
              No public social links added yet for this profile.
            </div>
          )}
        </div>

        {/* Modal Footer note */}
        <div className="mt-6 pt-4 border-t-2 border-black text-center">
          <p className="text-[11px] text-slate-500 font-bold">
            SPI IT Club • Shariatpur Polytechnic Institute
          </p>
        </div>
      </div>
    </div>
  );
};
