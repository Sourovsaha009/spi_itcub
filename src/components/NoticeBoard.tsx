import React, { useState } from 'react';
import { Megaphone, Calendar, AlertCircle, PlusCircle, Check, Copy, Tag } from 'lucide-react';
import { NoticeItem } from '../types';

interface NoticeBoardProps {
  notices: NoticeItem[];
  onOpenAdmin: () => void;
}

export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, onOpenAdmin }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (notice: NoticeItem) => {
    navigator.clipboard.writeText(`${notice.title}\nDate: ${notice.date}\n${notice.body}`);
    setCopiedId(notice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="notice" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8 relative z-20">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-[#F5B012]/40 p-6 sm:p-8 transition-shadow hover:shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl shadow-inner">
              <Megaphone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#003366] tracking-tight">Official Notice Board</h2>
              <p className="text-xs text-slate-500 font-medium">Important circulars, event notifications &amp; deadlines</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-full border border-slate-200">
              {notices.length} Active {notices.length === 1 ? 'Notice' : 'Notices'}
            </span>
            <button
              onClick={onOpenAdmin}
              className="text-xs bg-[#003366] hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#F5B012]" />
              <span>Post Notice</span>
            </button>
          </div>
        </div>

        {/* Notice List */}
        {notices.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 font-medium text-sm">No notices posted yet.</p>
            <p className="text-slate-400 text-xs mt-1">Check back later or post a new announcement through the Admin Panel.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`p-5 rounded-xl border-l-4 transition-all duration-200 ${
                  notice.isImportant
                    ? 'bg-amber-50/80 border-[#F5B012] shadow-sm hover:shadow'
                    : 'bg-slate-50/90 border-[#003366] shadow-sm hover:shadow'
                } flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
              >
                <div className="flex-1 pr-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
                      {notice.title}
                    </h3>
                    {notice.isImportant && (
                      <span className="bg-red-500 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        Urgent
                      </span>
                    )}
                    {notice.category && (
                      <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        {notice.category}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {notice.body}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
                  <span className="text-xs bg-white border border-slate-200 font-semibold px-3 py-1.5 rounded-lg text-slate-700 whitespace-nowrap shadow-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#003366]" />
                    <span>{notice.date}</span>
                  </span>

                  <button
                    onClick={() => handleCopy(notice)}
                    className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-[#003366] rounded-lg transition"
                    title="Copy notice details"
                  >
                    {copiedId === notice.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
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
