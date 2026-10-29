import React from 'react';
import { GalleryItem } from '../types';
import { Camera, Calendar, ZoomIn, Layers } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
  onSelectPhoto: (photo: GalleryItem) => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, onSelectPhoto }) => {
  return (
    <section id="gallery" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 neo-badge bg-[#10B981] text-black text-xs font-black uppercase mb-3 hover:-translate-y-0.5 transition-transform">
            <Camera className="w-3.5 h-3.5 stroke-[3]" />
            <span>Memories &amp; Activities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Photo Gallery
          </h2>
          <div className="w-20 h-1.5 bg-black mt-2 mb-3"></div>
          <p className="text-slate-700 font-medium text-sm sm:text-base">
            Highlights from workshops, seminars, coding bootcamps, and club ceremonies.
          </p>
        </div>

        {/* Gallery count indicator */}
        <div className="inline-flex items-center gap-2 neo-badge bg-[#FFE600] text-black text-xs font-black">
          <Layers className="w-3.5 h-3.5" />
          <span>{gallery.length} Albums &amp; Posts</span>
        </div>
      </div>

      {gallery.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-black">
          <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-black font-black text-base">No gallery photos added yet.</p>
          <p className="text-slate-500 text-xs mt-1">Check back later for event highlights!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {gallery.map((item) => {
            const totalPhotos = item.images && item.images.length > 0 ? item.images.length : 1;
            const hasMultiple = totalPhotos > 1;

            return (
              <div
                key={item.id}
                onClick={() => onSelectPhoto(item)}
                className="neo-card bg-white rounded-xl overflow-hidden flex flex-col cursor-pointer group"
              >
                {/* Image Container with Viewfinder HUD Effect */}
                <div className="h-60 sm:h-64 overflow-hidden bg-black relative border-b-2 border-black">
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  {/* Multi-Photo Album Tag */}
                  {hasMultiple && (
                    <span className="absolute top-3 left-3 neo-badge bg-[#FFE600] text-black text-[11px] font-black flex items-center gap-1 shadow-[2px_2px_0px_#000] z-10">
                      <Layers className="w-3 h-3 stroke-[2.5]" />
                      <span>{totalPhotos} Photos</span>
                    </span>
                  )}

                  {/* Tech Viewfinder HUD overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                    {/* Viewfinder corner brackets */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#FFE600]"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#FFE600]"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#FFE600]"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#FFE600]"></div>

                    {/* Zoom / View Album Badge */}
                    <span className="neo-badge bg-[#FFE600] text-black text-xs font-black px-3.5 py-1.5 flex items-center gap-1.5 shadow-[3px_3px_0px_#000] scale-90 group-hover:scale-100 transition-transform duration-200">
                      <ZoomIn className="w-4 h-4 stroke-[3]" />
                      <span>{hasMultiple ? `View Album (${totalPhotos} Photos)` : 'Expand Photo'}</span>
                    </span>
                  </div>

                  {item.date && (
                    <span className="absolute top-3 right-3 neo-badge bg-white text-black text-[11px] font-mono font-bold flex items-center gap-1 group-hover:opacity-0 transition-opacity">
                      <Calendar className="w-3 h-3 text-[#003366] stroke-[2.5]" />
                      <span>{item.date}</span>
                    </span>
                  )}
                </div>

                {/* Text Body */}
                <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="font-black text-black text-lg mb-1 group-hover:text-[#003366] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed line-clamp-2 font-medium">
                      {item.desc}
                    </p>
                  </div>

                  {hasMultiple && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-[#003366]" />
                        <span>Album with cover selected</span>
                      </span>
                      <span className="text-[#003366] font-black group-hover:underline">Open Album →</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
