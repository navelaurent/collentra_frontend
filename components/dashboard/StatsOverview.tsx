"use client";

import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { FolderOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import api from "@/lib/axios";
import { getUserInfo } from "@/helpers/authHelpers";

const statsTemplate = [
  {
    key: "groupCount",
    label: "Active Groups",
    description: "Groups you're managing",
    icon: FolderOpen,
    color: "from-primary to-accent",
  },
  {
    key: "taskCompleted",
    label: "Completed Tasks",
    description: "This month",
    icon: CheckCircle2,
    color: "from-emerald-500 to-teal-500",
  },
  {
    key: "taskRemaining",
    label: "Pending Tasks",
    description: "Awaiting completion",
    icon: Clock,
    color: "from-amber-500 to-orange-500",
  },
  {
    key: "teamPerformance",
    label: "Team Performance",
    description: "Average completion rate",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-500",
  },
];

export function StatsOverview() {
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = getUserInfo();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/Task/getHomeInformation", {
          params: { userId: user?.sid },
        });
        setApiData(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsTemplate.map((stat) => {
        const Icon = stat.icon;

        const dynamicValue = isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        ) : (
          (apiData?.[stat.key] ?? "0")
        );

        return (
          <Card key={stat.label} className="relative overflow-hidden p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {dynamicValue}
                  {stat.key === "performance" && !isLoading && "%"}
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
