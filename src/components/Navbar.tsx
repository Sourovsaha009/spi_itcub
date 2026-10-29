import React, { useState } from 'react';
import { Menu, X, UserPlus, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenJoin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenJoin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Notices', href: '#notice' },
    { name: 'Courses', href: '#courses' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Founders', href: '#founders' },
    { name: 'Committee', href: '#committee' },
    { name: 'FB Updates', href: '#fb-posts' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#FFFDF7] text-black border-b-[3px] border-black shadow-[0_4px_0px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title in Neo-Brutalist Badge */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-13 h-13 rounded-xl border-2 border-black bg-white p-0.5 shadow-[3px_3px_0px_0px_#000] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150">
                <img
                  src="./assets/aistudio/477647138_122109653414726359_696_b5f4c3a5.jpg"
                  alt="SPI IT Club Official Logo"
                  className="w-full h-full rounded-lg object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.jpg';
                  }}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#10B981] border-2 border-black rounded-full" title="Active Community"></span>
            </div>
            <div>
              <div className="font-black text-xl sm:text-2xl tracking-tight text-black flex items-center gap-1.5 leading-none">
                SPI IT CLUB
                <span className="hidden sm:inline-block bg-[#FFE600] text-black text-[10px] font-black uppercase px-1.5 py-0.5 border border-black rounded shadow-[1.5px_1.5px_0px_#000]">
                  CST
                </span>
              </div>
              <p className="text-[11px] text-slate-700 font-bold tracking-wide mt-1">
                Shariatpur Polytechnic Institute
              </p>
            </div>
          </a>

          {/* Desktop Nav Links & Neo Action Buttons */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="flex items-center space-x-5 mr-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-black font-extrabold text-sm hover:text-[#003366] relative py-1 px-1 transition-colors duration-150 hover:underline decoration-2 underline-offset-4"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <button
              onClick={onOpenJoin}
              className="neo-btn bg-[#FFE600] hover:bg-[#10B981] text-black font-black px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_#000] transition-colors"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Join Club</span>
            </button>
          </div>

          {/* Mobile menu toggle buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenJoin}
              className="neo-btn bg-[#FFE600] text-black p-2 rounded-lg font-black text-xs"
              title="Join Club"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="neo-btn bg-white text-black p-2 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown with Neo-Brutalist Frame */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF7] border-t-2 border-black px-4 pt-3 pb-6 space-y-2 shadow-[0_6px_0px_0px_#000]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block font-black text-black py-2.5 px-3 rounded-lg border-2 border-transparent hover:border-black hover:bg-[#FFE600] transition-colors text-sm"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoin();
              }}
              className="neo-btn w-full bg-[#FFE600] text-black font-black py-3 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Membership Registration</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
