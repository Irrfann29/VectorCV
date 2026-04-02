import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-6xl z-50">
      <div className="flex items-center justify-between px-6 py-3.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center font-bold text-white italic">V</div>
          <span className="text-white font-semibold text-lg tracking-tight">VectorCV</span>
        </div>

        {/* Navigation Links*/}
        <div className="hidden md:flex items-center gap-8">
          {['Store', 'Pro', 'AI', 'Blog','Pricing', 'Contact Us', 'Developers'].map((link) => (
            <a key={link} href={`#${link}`} className="text-gray-400 hover:text-white transition-colors text-base font-medium">
              {link}
            </a>
          ))}
        </div>

        {/* Right Section (Login & Download) */}
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
            Log in
          </button>
          <button className="bg-white text-black px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
            <span className="text-lg"></span> Download
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;