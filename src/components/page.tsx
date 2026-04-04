import React from "react";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Users, 
  BarChart2, 
  Play, 
  RotateCcw 
} from "lucide-react";
import Link from "next/link";

// --- 1. Mock Data for Speaking Tasks ---
const speakingTasks = [
  {
    slug: "ordering-coffee",
    title: "Ordering Coffee at a Cafe",
    thumbnail: "https://source.unsplash.com/random/800x450/?coffee,cafe",
    wordCount: 85,
    level: "Beginner",
    completions: 1240,
    isCompleted: true, // Done -> Will show Replay
  },
  {
    slug: "job-interview",
    title: "Common Job Interview Questions",
    thumbnail: "https://source.unsplash.com/random/800x450/?office,interview",
    wordCount: 210,
    level: "Intermediate",
    completions: 890,
    isCompleted: false, // New -> Will show Play
  },
  {
    slug: "airport-navigation",
    title: "Airport Navigation & Announcements",
    thumbnail: "https://source.unsplash.com/random/800x450/?airport,plane",
    wordCount: 150,
    level: "Intermediate",
    completions: 560,
    isCompleted: false,
  },
  {
    slug: "doctor-visit",
    title: "Describing Symptoms to a Doctor",
    thumbnail: "https://source.unsplash.com/random/800x450/?doctor,hospital",
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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, Alex! 👋</h1>
        <p className="mt-2 opacity-90 text-sm md:text-base">
          You have speaking tasks waiting for you. Let's practice!
        </p>
        <button className="mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-colors">
          View Schedule
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Active Courses"
          value="6"
          icon={BookOpen}
          color="bg-sky-500"
        />
        <DashboardCard
          title="Hours Practiced"
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
      </div>

      {/* Speaking Tasks Grid */}
   
    </div>
  );
}