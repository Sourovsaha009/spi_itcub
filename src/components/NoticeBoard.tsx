import React, { useState } from 'react';
import { Megaphone, Calendar, AlertCircle, PlusCircle, Check, Copy, BellRing, Radio } from 'lucide-react';
import { NoticeItem } from '../types';

interface NoticeBoardProps {
  notices: NoticeItem[];
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (notice: NoticeItem) => {
    navigator.clipboard.writeText(`${notice.title}\nDate: ${notice.date}\n${notice.body}`);
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="notice" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-10 relative z-20">
      <div className="neo-box-lg bg-white rounded-2xl p-6 sm:p-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-[3px] border-black pb-5 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center font-black text-2xl text-black hover:rotate-6 transition-transform">
              <Megaphone className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase flex items-center gap-2">
                Official Notice Board
              </h2>
              <p className="text-xs text-slate-700 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                <span>Live announcements &amp; academic circulars</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="neo-badge bg-black text-white text-xs font-mono font-black">
              COUNT: {notices.length}
            </span>
          </div>
        </div>

        {/* Notice List */}
        {notices.length === 0 ? (
          <div className="text-center py-12 bg-[#FFFDF7] rounded-xl border-2 border-dashed border-black">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-black font-black text-base">No notices posted yet.</p>
            <p className="text-slate-500 text-xs mt-1">Check back later or post a new announcement through the Admin Panel.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`neo-card p-5 rounded-xl ${
                  notice.isImportant
                    ? 'bg-[#FFFBEB] border-l-[6px] border-l-[#FF5A5F]'
                    : 'bg-[#FFFDF7] border-l-[6px] border-l-[#003366]'
                } flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-200`}
              >
                <div className="flex-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-black text-black text-base sm:text-lg leading-snug">
                      {notice.title}
                    </h3>
                    {notice.isImportant && (
                      <span className="neo-badge bg-[#FF5A5F] text-white text-[10px] font-black tracking-wider flex items-center gap-1 animate-radar">
                        <BellRing className="w-3 h-3 stroke-[3]" />
                        Urgent Circular
                      </span>
                    )}
                    {notice.category && (
                      <span className="neo-badge bg-white text-black text-[10px] font-mono font-bold">
                        #{notice.category}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
                    {notice.body}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                  <span className="neo-box bg-white text-black text-xs font-mono font-black px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#003366] stroke-[2.5]" />
                    <span>{notice.date}</span>
                  </span>

                  <button
                    onClick={() => handleCopy(notice)}
                    className="neo-btn bg-white hover:bg-[#FFE600] text-black p-2 rounded-lg cursor-pointer transition-colors"
                    title="Copy notice details"
                  >
                    {copiedId === notice.id ? (
                      <Check className="w-4 h-4 text-[#10B981] stroke-[3]" />
                    ) : (
                      <Copy className="w-4 h-4 stroke-[2]" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
