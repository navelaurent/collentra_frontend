"use client";

import { MainLayout } from "../../components/layout/MainLayout";
import { StatsOverview } from "../../components/dashboard/StatsOverview";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { getUserInfo } from "@/helpers/authHelpers";

export default function Home() {
  const user = getUserInfo();

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user ? user.name : "name"}!
            </h1>
            <p className="text-muted-foreground mt-1">Welcome to collentra</p>
          </div>
          <div className="flex gap-2"></div>
        </div>

        <StatsOverview />

        <ActivityFeed />
      </div>
    </MainLayout>
  );
}
