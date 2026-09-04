// app/(dashboard)/admin/_components/stats-cards.tsx
"use client";

import { Users, BookOpen, FileText, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCard {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
}

interface StatsCardsProps {
  stats: StatsCard[];
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center">
              <div className="text-indigo-600">{stat.icon}</div>
            </div>
            <span className={cn(
              "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1",
              stat.trend === "up" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            )}>
              {stat.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stat.change > 0 ? "+" : ""}{stat.change}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-3">{stat.value}</p>
          <p className="text-sm text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
};