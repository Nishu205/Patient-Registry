import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { X, Home, UserPlus, Search, Users } from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  useEffect(() => {
    const resizeHandler = () => {
      if (window.innerWidth >= 768 && open) {
        onClose();
      }
    };

    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [open, onClose]);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: <Home size={24} /> },
    { to: '/register', label: 'Register Patient', icon: <UserPlus size={24} /> },
    { to: '/patients', label: 'Patient Records', icon: <Users size={24} /> },
    { to: '/query', label: 'Query Records', icon: <Search size={24} /> },

  ];

  const selectedClass =
    'bg-rose-200 text-amber-900 font-bold shadow-sm border-l-4 border-transparent';
  const defaultClass =
    'text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 md:hidden"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <span className="text-xl font-bold text-rose-700 tracking-wide">CareLoop</span>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-8 py-3 rounded-md text-base font-bold ${isActive ? selectedClass : defaultClass}`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gradient-to-b from-rose-50 via-pink-50 to-amber-50 border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-100">
            <span className="text-4xl font-bold text-amber-700 tracking-wide">CareLoop</span>
          </div>
          <div className="flex-1 font-bold overflow-y-auto py-10 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-8 py-3 rounded-md text-base font-bold ${isActive ? selectedClass : defaultClass}`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
