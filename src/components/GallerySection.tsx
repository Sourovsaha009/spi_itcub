import React, { useState, useMemo } from 'react';
import { GalleryItem } from '../types';
import { Camera, Calendar, ZoomIn, Layers, ArrowUpDown, Search, X, SlidersHorizontal, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
  onSelectPhoto: (photo: GalleryItem) => void;
}

type SortOption = 'newest' | 'oldest' | 'photos' | 'alpha-asc' | 'alpha-desc';

function parseItemTimestamp(item: GalleryItem): number {
  if (item.createdAt) return item.createdAt;
  if (item.dateIso) {
    const t = new Date(item.dateIso).getTime();
    if (!isNaN(t)) return t;
  }
  if (item.date) {
    const t = new Date(item.date).getTime();
    if (!isNaN(t)) return t;
  }
  const idNum = Number(item.id);
  if (!isNaN(idNum) && idNum > 1000000) return idNum;
  return 0;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, onSelectPhoto }) => {
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered and sorted gallery items
  const processedGallery = useMemo(() => {
    let result = [...gallery];

    // Filter by search query (title, desc, or date)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.desc.toLowerCase().includes(q) ||
          (item.date && item.date.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return parseItemTimestamp(b) - parseItemTimestamp(a);
        case 'oldest':
          return parseItemTimestamp(a) - parseItemTimestamp(b);
        case 'photos': {
          const aCount = a.images && a.images.length > 0 ? a.images.length : 1;
          const bCount = b.images && b.images.length > 0 ? b.images.length : 1;
          return bCount - aCount;
        }
        case 'alpha-asc':
          return a.title.localeCompare(b.title);
        case 'alpha-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return result;
  }, [gallery, sortOption, searchQuery]);

  return (
    <section id="gallery" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 neo-badge bg-[#10B981] text-black text-xs font-black uppercase mb-3 hover:-translate-y-0.5 transition-transform">
            <Camera className="w-3.5 h-3.5 stroke-[3]" />
            <span>Memories &amp; Activities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
            Photo Gallery
          </h2>
          <div className="w-20 h-1.5 bg-black mt-2 mb-3"></div>
          <p className="text-slate-700 font-medium text-sm sm:text-base max-w-2xl">
            Highlights from workshops, seminars, coding bootcamps, and club ceremonies with date logs and multi-photo albums.
          </p>
        </div>

        {/* Gallery count indicator */}
        <div className="inline-flex items-center gap-2 neo-badge bg-[#FFE600] text-black text-xs font-black self-start md:self-auto py-2 px-3">
          <Layers className="w-4 h-4 stroke-[2.5]" />
          <span>{gallery.length} Albums &amp; Posts</span>
        </div>
      </div>

      {/* Interactive Sorting & Search Toolbar */}
      <div className="neo-box bg-white p-3.5 sm:p-4 rounded-xl mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-grow min-w-0">
          <Search className="w-4 h-4 text-black absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2.5]" />
          <input
            type="text"
            placeholder="Search albums by name, year, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFFDF7] border-2 border-black rounded-lg pl-10 pr-9 py-2.5 sm:py-2 text-xs sm:text-sm font-medium focus:outline-none focus:shadow-[3px_3px_0px_#000] min-h-[44px]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-black"
              title="Clear search"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown / Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="gallery-sort-select" className="inline-flex items-center gap-1.5 text-xs font-black text-black uppercase shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Sort:</span>
          </label>
          <div className="relative flex-grow sm:flex-grow-0">
            <select
              id="gallery-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full sm:w-auto bg-[#FFE600] border-2 border-black font-black text-xs sm:text-sm rounded-lg px-3 py-2.5 sm:py-2 focus:outline-none focus:shadow-[3px_3px_0px_#000] cursor-pointer min-h-[44px] pr-8 appearance-none"
            >
              <option value="newest">📅 Newest Date First</option>
              <option value="oldest">⏳ Oldest Date First</option>
              <option value="photos">🖼️ Most Photos (Album Size)</option>
              <option value="alpha-asc">🔤 Title (A to Z)</option>
              <option value="alpha-desc">🔤 Title (Z to A)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>
        </div>
      </div>

      {/* Results summary if searching */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between text-xs font-bold text-slate-700 bg-[#FFFDF7] p-2.5 rounded-lg border-2 border-dashed border-black">
          <span>Found {processedGallery.length} matching post(s) for &ldquo;{searchQuery}&rdquo;</span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#003366] underline font-black hover:text-black cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Gallery Cards Grid */}
      {processedGallery.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-black p-6">
          <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-black font-black text-base">No gallery posts found.</p>
          <p className="text-slate-500 text-xs mt-1">
            {searchQuery ? 'Try searching with different keywords.' : 'Check back later for event highlights!'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="neo-btn bg-[#FFE600] text-black text-xs font-black px-4 py-2 rounded-lg mt-4"
            >
              Reset Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {processedGallery.map((item) => {
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

                  {/* Prominent Date Chip in Card Header */}
                  {item.date && (
                    <span className="absolute top-3 right-3 neo-badge bg-white text-black text-[11px] font-mono font-bold flex items-center gap-1 shadow-[2px_2px_0px_#000] z-10">
                      <Calendar className="w-3 h-3 text-[#003366] stroke-[2.5]" />
                      <span>{item.date}</span>
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
                    <span className="neo-badge bg-[#FFE600] text-black text-xs font-black px-4 py-2 flex items-center gap-1.5 shadow-[3px_3px_0px_#000] scale-95 group-hover:scale-100 transition-transform duration-200 min-h-[38px]">
                      <ZoomIn className="w-4 h-4 stroke-[3]" />
                      <span>{hasMultiple ? `View Album (${totalPhotos} Photos)` : 'Expand Photo'}</span>
                    </span>
                  </div>
                </div>

                {/* Text Body */}
                <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-black text-black text-lg group-hover:text-[#003366] transition-colors leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed line-clamp-2 font-medium">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom Footer Strip */}
                  <div className="mt-4 pt-3 border-t-2 border-slate-100 flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-[#003366]" />
                      <span>{item.date || 'Event date logged'}</span>
                    </span>
                    <span className="neo-btn bg-[#FFE600] text-black text-[11px] font-black px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_#000]">
                      {hasMultiple ? `Browse ${totalPhotos} Photos →` : 'View →'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
