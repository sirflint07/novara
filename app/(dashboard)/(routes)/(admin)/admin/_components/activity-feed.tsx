"use client";

import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "user" | "course" | "blog" | "system";
  title: string;
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const activityColors = {
  user: "bg-blue-100 text-blue-600",
  course: "bg-emerald-100 text-emerald-600",
  blog: "bg-purple-100 text-purple-600",
  system: "bg-amber-100 text-amber-600",
};

const activityEmojis = {
  user: "👤",
  course: "📚",
  blog: "📝",
  system: "⚙️",
};

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-sm shrink-0",
                  activityColors[activity.type]
                )}>
                  {activityEmojis[activity.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-500">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};