import React, { useState, useEffect } from 'react';
import { X, Calendar, ChevronLeft, ChevronRight, Layers, Star } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  photo: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ photo, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync index whenever a new photo album is opened
  useEffect(() => {
    if (photo) {
      const images = photo.images && photo.images.length > 0 ? photo.images : [photo.url];
      const initialIdx = images.indexOf(photo.url);
      setCurrentIndex(initialIdx >= 0 ? initialIdx : 0);
    }
  }, [photo]);

  // Keyboard navigation
  useEffect(() => {
    if (!photo) return;
    const images = photo.images && photo.images.length > 0 ? photo.images : [photo.url];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose]);

  if (!photo) return null;

  const images = photo.images && photo.images.length > 0 ? photo.images : [photo.url];
  const hasMultiple = images.length > 1;
  const currentImageUrl = images[currentIndex] || photo.url;
  const isCover = currentImageUrl === photo.url;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 cursor-zoom-out animate-in fade-in duration-150 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-[#FFFDF7] rounded-2xl overflow-hidden cursor-default border-[3px] border-black shadow-[8px_8px_0px_0px_#FFE600] my-auto flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="neo-btn absolute top-4 right-4 z-20 bg-[#FFE600] text-black p-2 rounded-xl cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
        </button>

        {/* Counter Badge if multiple images */}
        {hasMultiple && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
            <span className="neo-badge bg-black text-[#FFE600] text-xs font-mono font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#FFE600]">
              <Layers className="w-3.5 h-3.5" />
              <span>{currentIndex + 1} / {images.length} PHOTOS</span>
            </span>
            {isCover && (
              <span className="neo-badge bg-[#FFE600] text-black text-[11px] font-black flex items-center gap-1">
                <Star className="w-3 h-3 fill-black text-black" />
                <span>COVER</span>
              </span>
            )}
          </div>
        )}

        {/* Main Image Frame with Prev/Next Controls */}
        <div className="relative max-h-[65vh] bg-black flex items-center justify-center overflow-hidden border-b-[3px] border-black select-none group">
          <img
            src={currentImageUrl}
            alt={`${photo.title} - Photo ${currentIndex + 1}`}
            className="max-h-[65vh] w-auto max-w-full object-contain transition-opacity duration-200"
          />

          {/* Previous Button */}
          {hasMultiple && (
            <button
              onClick={handlePrev}
              className="neo-btn absolute left-4 top-1/2 -translate-y-1/2 bg-[#FFE600] hover:bg-white text-black p-2.5 rounded-xl cursor-pointer shadow-[3px_3px_0px_#000] transition-transform active:scale-95"
              title="Previous photo (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
            </button>
          )}

          {/* Next Button */}
          {hasMultiple && (
            <button
              onClick={handleNext}
              className="neo-btn absolute right-4 top-1/2 -translate-y-1/2 bg-[#FFE600] hover:bg-white text-black p-2.5 rounded-xl cursor-pointer shadow-[3px_3px_0px_#000] transition-transform active:scale-95"
              title="Next photo (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Thumbnail Selector Strip for multi-photo posts */}
        {hasMultiple && (
          <div className="bg-slate-900 border-b-2 border-black p-2.5 overflow-x-auto flex gap-2 items-center justify-start sm:justify-center">
            {images.map((img, idx) => {
              const active = idx === currentIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-transform cursor-pointer ${
                    active
                      ? 'border-[#FFE600] ring-2 ring-[#FFE600] scale-105 shadow-[2px_2px_0px_#FFE600]'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                  title={`View photo ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {img === photo.url && (
                    <span className="absolute bottom-0 inset-x-0 bg-[#FFE600] text-black text-[8px] font-black uppercase text-center leading-tight">
                      COVER
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Caption & Metadata Footer */}
        <div className="p-4 sm:p-5 bg-white text-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-lg sm:text-xl text-black mb-1 uppercase tracking-tight flex items-center gap-2">
              <span>{photo.title}</span>
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              {photo.desc}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {photo.date && (
              <span className="neo-badge bg-[#FFE600] text-black text-xs font-black flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{photo.date}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
