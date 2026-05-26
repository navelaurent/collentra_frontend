"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Star, Trophy, Award } from "lucide-react";
import { useState } from "react";

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

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Profile Header */}
        <Card className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-2xl">
                  AJ
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                Alex Johnson
              </h1>
              <p className="text-muted-foreground mt-1">
                Product Designer & Team Lead
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary">4 Groups</Badge>
                <Badge variant="outline">12 Friends</Badge>
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < 4.5 ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    4.5 (24 ratings)
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Save" : "Edit Profile"}
            </Button>
          </div>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>

          {/* About Tab */}
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
                  <Input
                    value="alex.johnson@company.com"
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Bio
                  </label>
                  <textarea
                    disabled={!isEditing}
                    defaultValue="Passionate about design and team collaboration. Currently leading the design system initiative."
                    className="w-full mt-1 p-2 rounded-lg border border-border bg-background text-foreground disabled:opacity-60"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Location
                    </label>
                    <Input
                      value="San Francisco, CA"
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Role
                    </label>
                    <Input
                      value="Product Designer"
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Statistics</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Groups Joined</p>
                  <p className="text-2xl font-bold text-foreground mt-2">4</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tasks Completed
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-2">34</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold text-foreground mt-2">
                    4.5★
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-xl font-bold text-foreground mt-2">6 mo</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <Card key={achievement.id} className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-primary/20 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-foreground">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      {achievement.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">
                Feedback from Team Members
              </h3>
              <div className="space-y-4">
                {mockRatings.map((rating) => (
                  <div
                    key={rating.id}
                    className="p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {rating.from}
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
                        {rating.project}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground mt-3">
                      {rating.comment}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {rating.date}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
