import React from 'react';
import { FbPostItem } from '../types';
import { Facebook, ExternalLink, MessageSquare, ThumbsUp } from 'lucide-react';

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
      <div className="neo-box-lg bg-white rounded-2xl p-6 sm:p-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b-[3px] border-black pb-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_#000]">
                <Facebook className="w-5 h-5 fill-current" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight uppercase">
                Official Facebook Updates
              </h2>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm font-bold">
              Live highlights, registration alerts, and activity posts from our official Facebook community page
            </p>
          </div>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn bg-[#2563EB] text-white font-black px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Follow Our Page</span>
            <ExternalLink className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="neo-card bg-[#FFFDF7] rounded-xl p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-black mb-3">
                  <div className="neo-badge bg-[#2563EB] text-white text-[10px] flex items-center gap-1">
                    <Facebook className="w-3 h-3 fill-current" />
                    <span>SPI IT POST</span>
                  </div>
                  <span className="neo-badge bg-white text-black text-[10px] font-bold">{post.date}</span>
                </div>

                <h3 className="font-black text-black text-base mb-2 leading-snug group-hover:text-[#2563EB] transition-colors">
                  {post.title}
                </h3>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  {post.snippet}
                </p>
              </div>

              <div className="pt-4 border-t-2 border-black flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-black font-bold">
                  <span className="flex items-center gap-1 text-[11px]">
                    <ThumbsUp className="w-3.5 h-3.5 text-[#2563EB] stroke-[2.5]" />
                    <span>Like</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500 stroke-[2.5]" />
                    <span>Comment</span>
                  </span>
                </div>

                <a
                  href={post.link || facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn bg-[#FFE600] text-black font-black px-3 py-1 rounded text-xs flex items-center gap-1.5"
                >
                  <span>View Post</span>
                  <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
