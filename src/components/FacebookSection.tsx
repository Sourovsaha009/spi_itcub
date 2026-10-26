import React from 'react';
import { FbPostItem } from '../types';
import { Facebook, ExternalLink, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

interface FacebookSectionProps {
  posts: FbPostItem[];
  facebookUrl?: string;
}

export const FacebookSection: React.FC<FacebookSectionProps> = ({
  posts,
  facebookUrl = "https://www.facebook.com/SPIitClub01"
}) => {
  return (
    <section id="fb-posts" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-sm">
                <Facebook className="w-5 h-5 fill-current" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#003366] tracking-tight">
                Official Facebook Updates
              </h2>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm">
              Live highlights, registration alerts, and activity posts from our official Facebook community page
            </p>
          </div>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Follow Our Page</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-blue-600 font-bold mb-3">
                  <div className="flex items-center gap-1.5">
                    <Facebook className="w-4 h-4 fill-current" />
                    <span>SPI IT CLUB POST</span>
                  </div>
                  <span className="text-slate-400 font-normal">{post.date}</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-2 leading-snug">
                  {post.title}
                </h3>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                  {post.snippet}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500">
                  <span className="flex items-center gap-1 text-[11px]">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Like</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Comment</span>
                  </span>
                </div>

                <a
                  href={post.link || facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1.5 hover:underline"
                >
                  <span>View Post</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
