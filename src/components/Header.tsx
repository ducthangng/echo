"use client";

import React from "react";
import { Menu, Bell, Search, User } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      {/* Left Section: Hamburger (Mobile) & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100"
        >
          <Menu className="w-6 h-6 text-slate-600" />
        </button>

        {/* Search Bar (Hidden on very small screens) */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 gap-2 w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses..."
            className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right Section: Notifications & Profile */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-700">Alex Student</p>
            <p className="text-xs text-slate-500">Grade 10</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-400 to-yellow-300 flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;