import React from "react";
import { BookOpen, Clock, CheckCircle, Users, BarChart2, RotateCcw, Play } from "lucide-react";
import Link from "next/link";

// --- 1. Mock Data for Speaking Tasks ---
const speakingTasks = [
  {
    slug: "ordering-coffee", // URL: /shadowing/ordering-coffee
    title: "Ordering Coffee at a Cafe",
    thumbnail:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=2122&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder image
    wordCount: 85,
    level: "Beginner",
    completions: 1240,
    isCompleted: true,
  },
  {
    slug: "job-interview",
    title: "Common Job Interview Questions",
    thumbnail:
      "https://images.unsplash.com/photo-1686771416282-3888ddaf249b?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    wordCount: 210,
    level: "Intermediate",
    completions: 890,
    isCompleted: false,
  },
  {
    slug: "airport-navigation",
    title: "Airport Navigation & Announcements",
    thumbnail:
      "https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    wordCount: 150,
    level: "Intermediate",
    completions: 560,
    isCompleted: false,
  },
  {
    slug: "doctor-visit",
    title: "Describing Symptoms to a Doctor",
    thumbnail:
      "https://images.unsplash.com/photo-1633613286880-dae9f126b728?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    wordCount: 180,
    level: "Advanced",
    completions: 320,
    isCompleted: true,
  },
];

// Helper to map levels to colors
const levelConfig: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: "bg-emerald-100", text: "text-emerald-700" },
  Intermediate: { bg: "bg-amber-100", text: "text-amber-700" },
  Advanced: { bg: "bg-rose-100", text: "text-rose-700" },
};

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  return (
    <div className="space-y-6 p-4 lg:p-8">
      {/* Welcome Section (Kept from previous) */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg flex justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, Alex! 👋
          </h1>
          <p className="mt-2 opacity-90 text-sm md:text-base">
            You have 3 assignments due this week. Keep up the good work!
          </p>
          <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors">
            View Schedule
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
          <DashboardCard
            title="Active Courses"
            value="6"
            icon={BookOpen}
            color="bg-sky-500"
          />
          <DashboardCard
            title="Hours Studied"
            value="12.5 hrs"
            icon={Clock}
            color="bg-amber-500"
          />
          <DashboardCard
            title="Completed Tasks"
            value="24"
            icon={CheckCircle}
            color="bg-emerald-500"
          />
          <DashboardCard
            title="Completed Tasks"
            value="24"
            icon={CheckCircle}
            color="bg-emerald-500"
          />
        </div>

        <div></div>
      </div>

      {/* --- NEW: Speaking Tasks Grid --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Speaking Tasks</h2>
          <span className="text-sm text-indigo-600 font-medium hover:underline cursor-pointer">
            View All
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {speakingTasks.map((task) => (
            <Link
              href={`/shadowing/${task.slug}`}
              key={task.slug}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={task.thumbnail}
                  alt={task.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />

                {/* Gradient Overlay for better contrast */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                {/* --- Play / Replay Button --- */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`
                      w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center 
                      shadow-lg transform transition-all duration-200
                      group-hover:scale-110 group-hover:bg-white
                    `}
                  >
                    {task.isCompleted ? (
                      // Re-do / Replay Icon
                      <RotateCcw className="w-5 h-5 text-indigo-600" />
                    ) : (
                      // Play Icon
                      <Play className="w-5 h-5 text-indigo-600 ml-0.5" />
                    )}
                  </div>
                </div>

                {/* Level Badge (Top Left) */}
                <div
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                    levelConfig[task.level].bg
                  } ${levelConfig[task.level].text}`}
                >
                  {task.level}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {task.title}
                </h3>

                <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                  {/* Word Count */}
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5" />
                    <span>{task.wordCount} words</span>
                  </div>

                  {/* Completions Count */}
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>{task.completions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
