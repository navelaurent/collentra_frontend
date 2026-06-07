"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Star,
  Trophy,
  Award,
  Mars,
  Venus,
  Cake,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/helpers/authHelpers";
import api from "@/lib/axios";

interface GetRatingResponse {
  rating: number;
  rateCount: number;
  groupCount?: number;
  taskCompleted?: number;
  memberSince?: string;
  [key: string]: any;
}

const mockAchievements = [
  {
    id: "1",
    name: "Team Player",
    description: "Completed 10 group projects",
    icon: Trophy,
  },
  {
    id: "2",
    name: "Top Performer",
    description: "Achieved 95%+ completion rate",
    icon: Award,
  },
  {
    id: "3",
    name: "Quick Starter",
    description: "Started 5 groups",
    icon: Star,
  },
];

const mockRatings = [
  {
    id: "1",
    from: "Sarah Johnson",
    rating: 5,
    comment:
      "Excellent work on the design system. Very thorough and professional.",
    project: "Design System",
    date: "2024-03-28",
  },
  {
    id: "2",
    from: "Mike Chen",
    rating: 4,
    comment: "Great collaboration on the API documentation.",
    project: "Design System",
    date: "2024-03-25",
  },
  {
    id: "3",
    from: "Emma Davis",
    rating: 5,
    comment: "Always delivers quality work on time.",
    project: "Marketing Campaign",
    date: "2024-03-20",
  },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const user = getUserInfo();
  const [rate, setRate] = useState<GetRatingResponse | null>(null);
  const [homeInfo, setHomeInfo] = useState<GetRatingResponse | null>(null);
  const [ratingDetail, setRatingDetail] = useState<GetRatingResponse | null>(
    null,
  );

  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await api.get("/RatingComment/get-rating", {
          params: { userId: user?.sid },
        });
        setRate(res.data.data);
      } catch (err) {
        console.error("Error fetching rating:", err);
      }
    };

    const fetchStats = async () => {
      try {
        setIsLoadingStats(true);
        const res = await api.get("/Task/getHomeInformation", {
          params: { userId: user?.sid },
        });
        setHomeInfo(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    const fetchRatingDetail = async () => {
      try {
        setIsLoadingStats(true);
        const res = await api.get("/RatingComment/get-rate-comment", {
          params: { userId: user?.sid },
        });
        setRatingDetail(res.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
    fetchRating();
    fetchRatingDetail();
  }, []);

  const formatMemberSince = (dateString: string | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                  {user?.name?.substring(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {user ? user?.name : "name"}
              </h1>

              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">{homeInfo?.groupCount} Groups</Badge>
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${rate && i < Math.round(rate.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    {rate?.rating || 0} ({rate?.rateCount || 0} ratings)
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Save" : "Edit Profile"}
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <div className="relative mt-1">
                    <Input
                      value={user?.email || ""}
                      disabled
                      className="pl-10 font-medium transition-colors border-white/20 text-foreground bg-background disabled:opacity-100"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Bio
                  </label>
                  <textarea
                    disabled={!isEditing}
                    defaultValue="Passionate about design and team collaboration. Currently leading the design system initiative."
                    className="w-full mt-1 p-2 rounded-lg border border-white/20 bg-background text-foreground disabled:opacity-60"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </label>
                    <div className="relative mt-1">
                      <Input
                        value={formatMemberSince(homeInfo?.dob)}
                        disabled
                        className="pl-10 font-medium transition-colors border-white/20 text-foreground bg-background disabled:opacity-100"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Cake className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Gender
                    </label>
                    <div className="relative mt-1">
                      <Input
                        value={homeInfo?.gender === "M" ? "Male" : "Female"}
                        disabled
                        className={`pl-10 font-medium transition-colors ${
                          homeInfo?.gender === "M"
                            ? "border-blue-500/50 text-blue-400 bg-blue-500/5 disabled:opacity-100"
                            : "border-pink-500/50 text-pink-400 bg-pink-500/5 disabled:opacity-100"
                        }`}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {homeInfo?.gender === "M" ? (
                          <Mars className="h-4 w-4 text-blue-400" />
                        ) : (
                          <Venus className="h-4 w-4 text-pink-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Groups Joined</p>
                  {isLoadingStats ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {homeInfo?.groupCount}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tasks Completed
                  </p>
                  {isLoadingStats ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {homeInfo?.taskCompleted}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  {isLoadingStats ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {rate?.rating || 0}★
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  {isLoadingStats ? (
                    <div className="h-8 w-28 bg-muted animate-pulse rounded mt-2"></div>
                  ) : (
                    <p className="text-xl font-bold text-foreground mt-2">
                      {formatMemberSince(homeInfo?.memberSince)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ratings" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Feedback from Group Members
              </h3>
              <div className="space-y-4">
                {ratingDetail?.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No ratings yet.
                  </p>
                ) : (
                  ratingDetail?.map((rating) => (
                    <div
                      key={rating.ratingId}
                      className="p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {rating.raterName}{" "}
                            <span className="text-xs font-normal text-muted-foreground/80 dark:text-gray-400">
                              ({rating.raterEmail})
                            </span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < rating.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Group : {rating.groupName || "General"}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground mt-3">
                        {rating.comment}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatMemberSince(rating.timeRated)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
