"use client";

import { Card } from "../ui/card";
import { FolderOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Active Groups",
    value: "5",
    description: "Groups you're managing",
    icon: FolderOpen,
    color: "from-primary to-accent",
  },
  {
    label: "Completed Tasks",
    value: "24",
    description: "This month",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Pending Tasks",
    value: "8",
    description: "Awaiting completion",
    icon: Clock,
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Team Performance",
    value: "92%",
    description: "Average completion rate",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-500",
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="relative overflow-hidden p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`rounded-lg bg-gradient-to-br ${stat.color} p-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
