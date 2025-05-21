import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, HeartPulse } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  return (
    <nav className="bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 shadow-md text-gray-900">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="md:hidden p-2 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse className="h-7 w-7 text-white"/>
              <span className="text-2xl font-semibold tracking-tight">MediBuddy</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium">Dr. Tom</span>
              <span className="text-xs text-black/80">Neurologist</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center shadow-md">
              DR
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
