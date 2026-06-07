"use client";

import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getUserInfo } from "@/helpers/authHelpers";
import api from "@/lib/axios";

export function ActivityFeed() {
  const user = getUserInfo();
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/Task/getTaskDeadline", {
          params: { assigneeId: user?.sid },
        });
        const data = res.data?.data || res.data || [];
        setEvents(data);
      } catch (error) {
        console.error("Failed fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.sid]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isPast = (date: Date) => {
    return date.getTime() < startOfToday().getTime();
  };

  const isWithinNextFiveDays = (date: Date) => {
    const start = startOfToday();

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() + 4);

    return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
  };

  const isSameDay = (d: Date, day: number) =>
    d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;

  const getDaysUntilDeadline = (dueDate: string | Date) => {
    const now = new Date();
    const deadline = new Date(dueDate);
    const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const deadlineUtc = Date.UTC(
      deadline.getFullYear(),
      deadline.getMonth(),
      deadline.getDate(),
    );
    const diffDays = Math.ceil((deadlineUtc - nowUtc) / MS_PER_DAY);
    return diffDays;
  };

  const upcomingDeadlines = events
    .filter((e) => {
      if (!e.dueDate) return false;
      if (e.stats === "Done") return false;
      const d = new Date(e.dueDate);
      if (isPast(d)) return false;
      return isWithinNextFiveDays(d);
    })
    .sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
    );

  const daySpecificEvents = selectedDay
    ? events
        .filter((e) => {
          if (!e.dueDate) return false;
          if (e.stats === "Done") return false;
          const d = new Date(e.dueDate);
          if (isPast(d)) return false;
          return isSameDay(d, selectedDay);
        })
        .sort(
          (a, b) =>
            new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
        )
    : [];

  const buildDisplayList = () => {
    const result: any[] = [];
    const usedIds = new Set<string | number>();

    const primary = selectedDay ? daySpecificEvents : upcomingDeadlines;

    for (const ev of primary) {
      if (result.length >= 5) break;
      if (!usedIds.has(ev.id)) {
        result.push(ev);
        usedIds.add(ev.id);
      }
    }

    if (result.length < 5) {
      const others = events
        .filter((e) => {
          if (e.stats === "Done") return false;
          if (usedIds.has(e.id)) return false;
          if (e.dueDate) {
            const d = new Date(e.dueDate);
            if (isPast(d)) return false;
          }
          return true;
        })
        .sort((a, b) => {
          const aHas = a.dueDate ? 0 : 1;
          const bHas = b.dueDate ? 0 : 1;
          if (aHas !== bHas) return aHas - bHas;
          if (a.dueDate && b.dueDate) {
            return (
              new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
            );
          }
          return 0;
        });

      for (const ev of others) {
        if (result.length >= 5) break;
        result.push(ev);
        usedIds.add(ev.id);
      }
    }

    return result;
  };

  const displayEvents = buildDisplayList();

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-foreground">Your Task List</h2>
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 min-h-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Loading Schedule...
            </p>
          </div>
        ) : displayEvents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-muted-foreground">No events found.</p>
          </div>
        ) : (
          <>
            {displayEvents.map((event) => {
              const due = event.dueDate ? new Date(event.dueDate) : null;
              const isWarning = due ? isWithinNextFiveDays(due) : false;
              const daysLeft = due ? getDaysUntilDeadline(due) : null;

              const deadlineLabel =
                daysLeft === null
                  ? null
                  : daysLeft < 0
                    ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? "s" : ""}`
                    : daysLeft === 0
                      ? "Due today"
                      : daysLeft === 1
                        ? "Due tomorrow"
                        : `Due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`;

              return (
                <div
                  key={event.id}
                  className={`group p-3 rounded-xl border transition-all cursor-pointer ${
                    event.isDeleted
                      ? "bg-red-500/10 border-red-500/30 hover:border-red-500/50"
                      : event.stats === "Done"
                        ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                  }`}
                >
                  <Link href={`/groups/${event.groupId}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                            {event.title}
                          </div>

                          {isWarning && daysLeft !== null && (
                            <span className="ml-2 text-[11px] font-bold text-red-800 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
                              !! Warning deadline almost here — {deadlineLabel}
                            </span>
                          )}
                        </div>

                        {event.description && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                            {event.description}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">
                            {event.dueDate
                              ? new Date(event.dueDate).toLocaleDateString()
                              : "No Date"}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded ${
                          event.priority?.toLowerCase() === "critical"
                            ? "bg-red-500/10 text-red-400 border-red-500/30"
                            : event.priority?.toLowerCase() === "high"
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                              : event.priority?.toLowerCase() === "medium"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        }`}
                      >
                        {event.priority}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight italic">
                        Group : {event.groupName}
                      </span>
                      {event.stats === "Done" && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}

            {displayEvents.length >= 1 && (
              <div className="pt-2 text-center">
                <Link
                  href="/calendar"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  See more upcoming task
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
