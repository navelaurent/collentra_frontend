"use client";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  CheckCircle2,
  MessageSquare,
  UserPlus,
  Clock,
  Star,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "task_completed",
    user: "Sarah Johnson",
    avatar: "SJ",
    action: "completed task",
    target: "API Documentation",
    group: "Design System",
    timestamp: "2 hours ago",
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: "comment",
    user: "Mike Chen",
    avatar: "MC",
    action: "commented on",
    target: "Mobile Redesign",
    group: "Product Team",
    timestamp: "4 hours ago",
    icon: MessageSquare,
  },
  {
    id: 3,
    type: "member_added",
    user: "Emma Davis",
    avatar: "ED",
    action: "joined the group",
    target: "Marketing Campaign",
    group: "Marketing",
    timestamp: "6 hours ago",
    icon: UserPlus,
  },
  {
    id: 4,
    type: "deadline",
    user: "Project Lead",
    avatar: "PL",
    action: "deadline approaching for",
    target: "Q1 Planning",
    group: "Executive",
    timestamp: "1 day ago",
    icon: Clock,
  },
  {
    id: 5,
    type: "rating",
    user: "Alex Thompson",
    avatar: "AT",
    action: "rated your work on",
    target: "Frontend Development",
    group: "Tech Team",
    timestamp: "1 day ago",
    icon: Star,
  },
];

export function ActivityFeed() {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-foreground">
                    {activity.user}
                  </p>
                  <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                    <span className="font-medium text-foreground ml-1">
                      {activity.target}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {activity.group}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
