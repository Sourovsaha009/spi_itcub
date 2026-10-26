import React from 'react';
import { X, Calendar, Download } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  photo: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl cursor-default border border-white/10"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="max-h-[75vh] bg-black flex items-center justify-center overflow-hidden">
          <img
            src={photo.url}
            alt={photo.title}
            className="max-h-[75vh] w-auto max-w-full object-contain"
          />
        </div>

        <div className="p-5 bg-slate-900 text-white border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-xl text-[#F5B012] mb-1">{photo.title}</h3>
            <p className="text-slate-300 text-sm max-w-2xl">{photo.desc}</p>
          </div>

          {photo.date && (
            <span className="bg-white/10 text-slate-200 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#F5B012]" />
              <span>{photo.date}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
