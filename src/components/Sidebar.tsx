"use client";

import React from "react";
import {
  Home,
  BookOpen,
  Calendar,
  Award,
  MessageSquare,
  Settings,
  X,
  GraduationCap,
} from "lucide-react";

// Define navigation items
const navItems = [
  { name: "Dashboard", icon: Home, color: "text-sky-500", href: "/" },
  {
    name: "My Courses",
    icon: BookOpen,
    color: "text-pink-500",
    href: "/courses",
  },
  {
    name: "Schedule",
    icon: Calendar,
    color: "text-amber-500",
    href: "/schedule",
  },
  { name: "Grades", icon: Award, color: "text-emerald-500", href: "/grades" },
  {
    name: "Messages",
    icon: MessageSquare,
    color: "text-purple-500",
    href: "/messages",
  },
  {
    name: "Settings",
    icon: Settings,
    color: "text-gray-500",
    href: "/settings",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <div className="h-full">
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-slate-200 
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white ">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8" />
            <span className="font-bold text-lg tracking-wide">EduFun</span>
          </div>
          {/* Close button for mobile */}
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors group"
                >
                  <item.icon
                    className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Fun Decoration at bottom */}
      <div className="absolute bottom-8 left-0 right-0 px-4 w-64">
        <div className="bg-indigo-50 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">🚀</div>
          <p className="text-xs text-indigo-600 font-semibold">
            Keep Learning!
          </p>
          <p className="text-xs text-slate-500">You are doing great.</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
