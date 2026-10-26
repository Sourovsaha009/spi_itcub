import React from 'react';
import { GalleryItem } from '../types';
import { Camera, Calendar, ZoomIn, ImagePlus } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
  onSelectPhoto: (photo: GalleryItem) => void;
  onOpenAdmin: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, onSelectPhoto, onOpenAdmin }) => {
  return (
    <section id="gallery" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00A896] bg-[#00A896]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5 text-[#00A896]" />
            <span>Memories &amp; Activities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#003366] tracking-tight">
            Photo Gallery
          </h2>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Highlights from workshops, seminars, coding bootcamps, and club ceremonies.
          </p>
        </div>

        <button
          onClick={onOpenAdmin}
          className="bg-white border-2 border-[#003366] text-[#003366] hover:bg-[#003366] hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <ImagePlus className="w-4 h-4 text-[#F5B012]" />
          <span>Upload Photos (Admin)</span>
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold">No gallery photos added yet.</p>
          <p className="text-slate-400 text-xs mt-1">Use the Admin Panel to upload high-res event moments!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPhoto(item)}
              className="group bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="h-56 sm:h-64 overflow-hidden bg-slate-900 relative">
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                
                {/* Overlay with zoom icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/90 text-[#003366] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-[#00A896]" />
                    <span>Click to Expand</span>
                  </span>
                </div>

                {item.date && (
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/20">
                    <Calendar className="w-3 h-3 text-[#F5B012]" />
                    <span>{item.date}</span>
                  </span>
                )}
              </div>

              {/* Text Body */}
              <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                <div>
                  <h3 className="font-extrabold text-[#003366] text-lg mb-1 group-hover:text-[#00A896] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
