import React, { useState } from 'react';
import { Laptop, ShieldCheck, Menu, X, UserPlus, Lock } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenJoin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenJoin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Notice Board', href: '#notice' },
    { name: 'Courses', href: '#courses' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Founders', href: '#founders' },
    { name: 'Committee', href: '#committee' },
    { name: 'FB Posts', href: '#fb-posts' },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#003366]/95 backdrop-blur-md text-white shadow-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="./assets/aistudio/477647138_122109653414726359_696_b5f4c3a5.jpg"
                alt="SPI IT Club Official Logo"
                className="w-13 h-13 rounded-full border-2 border-[#F5B012] object-contain bg-white shadow-md group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#003366] rounded-full" title="Online & Active"></span>
            </div>
            <div>
              <div className="font-extrabold text-xl sm:text-2xl tracking-wide text-white flex items-center gap-2 group-hover:text-[#F5B012] transition-colors">
                SPI IT CLUB
              </div>
              <p className="text-xs text-[#F5B012] font-medium tracking-wider">Shariatpur Polytechnic Institute</p>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-200 hover:text-[#F5B012] font-medium text-sm transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={onOpenJoin}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Join Club</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="bg-[#F5B012] hover:bg-amber-400 text-[#003366] font-bold px-4 py-2 rounded-xl text-sm transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Mobile menu buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={onOpenJoin}
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-lg text-xs font-bold"
              title="Join Club"
            >
              <UserPlus className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAdmin}
              className="bg-[#F5B012] text-[#003366] p-2 rounded-lg text-xs font-bold shadow"
              title="Admin Panel"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-[#F5B012] p-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A192F] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-200 hover:text-[#F5B012] py-2 px-2 rounded font-medium border-b border-white/5 text-sm"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoin();
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Membership Registration</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full bg-[#F5B012] hover:bg-amber-400 text-[#003366] font-bold py-2.5 rounded-xl text-sm transition shadow flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Management Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
