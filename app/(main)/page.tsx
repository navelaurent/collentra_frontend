"use client";

import { MainLayout } from "../../components/layout/MainLayout";
import { StatsOverview } from "../../components/dashboard/StatsOverview";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { Plus } from "lucide-react";
import { Button } from "../../components/ui/button";
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
            <p className="text-muted-foreground mt-1">Geda gedi geda geda</p>
          </div>
          <div className="flex gap-2">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Group
            </Button>
          </div>
        </div>

        <StatsOverview />

        <ActivityFeed />
      </div>
    </MainLayout>
  );
}
