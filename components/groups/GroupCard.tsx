'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Users, ArrowRight } from 'lucide-react';

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  leaderName: string;
  leaderInitials: string;
  progress: number;
  tasksTotal: number;
  tasksCompleted: number;
}

export function GroupCard({
  id,
  name,
  description,
  memberCount,
  leaderName,
  leaderInitials,
  progress,
  tasksTotal,
  tasksCompleted,
}: GroupCardProps) {
  return (
    <Link href={`/groups/${id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer h-full">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Progress</span>
              <span className="text-xs font-semibold text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Tasks</p>
              <p className="font-semibold text-foreground">
                {tasksCompleted}/{tasksTotal}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Members</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <p className="font-semibold text-foreground">{memberCount}</p>
              </div>
            </div>
          </div>

          {/* Leader */}
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs bg-accent text-accent-foreground">
                {leaderInitials}
              </AvatarFallback>
            </Avatar>
            <div className="text-xs">
              <p className="text-muted-foreground">Lead by</p>
              <p className="font-medium text-foreground">{leaderName}</p>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
