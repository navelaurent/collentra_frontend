"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  X,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { getUserInfo } from "@/helpers/authHelpers";
import Link from "next/link";

export default function CalendarPage() {
  const user = getUserInfo();
  const [currentDate, setCurrentDate] = useState(new Date());
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
        console.error("Gagal mengambil data kalender:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user?.sid]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const getDayEvents = (day: number) => {
    return events.filter((event) => {
      if (!event.dueDate) return false;
      const d = new Date(event.dueDate);
      return (
        d.getDate() === day &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  };

  const filteredEvents = selectedDay ? getDayEvents(selectedDay) : events;

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 gap-4 overflow-hidden">
        <div className="flex-none flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground mt-1">
              Real-time schedule for {user?.name || "your team"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 flex-1 min-h-0">
          <Card className="lg:col-span-2 p-4 lg:p-6 flex flex-col h-full">
            <div className="flex flex-col h-full gap-4">
              <div className="flex items-center justify-between flex-none">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-foreground">
                    {monthName} {year}
                  </h2>
                  <span className="text-xs text-primary font-medium">
                    Today:{" "}
                    {today.toLocaleDateString("en-EN", { dateStyle: "full" })}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentDate(new Date());
                      setSelectedDay(null);
                    }}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 flex-none">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="text-center font-bold text-xs uppercase tracking-wider text-muted-foreground py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 lg:gap-2 flex-1 min-h-0">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-full w-full bg-muted/10 rounded-lg min-h-[40px]"
                  />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayEvents = getDayEvents(day);
                  const isToday =
                    day === today.getDate() &&
                    month === today.getMonth() &&
                    year === today.getFullYear();
                  const isSelected = selectedDay === day;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`relative h-full w-full min-h-[40px] p-1.5 lg:p-2 rounded-lg border transition-all text-sm font-medium flex flex-col items-start justify-between
                        ${isToday ? "border-primary ring-2 ring-primary/20 ring-offset-2" : "border-border"}
                        ${isSelected ? "bg-primary text-primary-foreground border-primary" : dayEvents.length > 0 ? "bg-primary/5 hover:bg-primary/10" : "hover:border-primary/50"}
                      `}
                    >
                      <span
                        className={`${isToday && !isSelected ? "bg-primary text-primary-foreground h-6 w-6 rounded-full flex items-center justify-center" : isSelected ? "text-primary-foreground" : "text-foreground"}`}
                      >
                        {day}
                      </span>

                      {dayEvents.length > 0 && (
                        <div className="w-full mt-auto">
                          <div className="flex gap-1">
                            {dayEvents.slice(0, 3).map((ev, idx) => (
                              <div
                                key={idx}
                                className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : ev.priority === "Critical" ? "bg-destructive" : "bg-primary"}`}
                              />
                            ))}
                          </div>
                          <span
                            className={`text-[10px] block truncate ${isSelected ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                          >
                            {dayEvents.length} Task
                            {dayEvents.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4 flex-none">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-foreground">
                  {selectedDay
                    ? `Tasks on ${selectedDay} ${monthName}`
                    : "Upcoming Deadlines"}
                </h3>
                {selectedDay && (
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="flex items-center gap-1 text-[10px] text-primary hover:underline"
                  >
                    <X className="h-3 w-3" /> Clear filter
                  </button>
                )}
              </div>
              <Badge variant="outline">{filteredEvents.length}</Badge>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 min-h-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Memuat jadwal...
                  </p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">
                    No events found.
                  </p>
                </div>
              ) : (
                filteredEvents
                  .sort(
                    (a, b) =>
                      new Date(a.dueDate).getTime() -
                      new Date(b.dueDate).getTime(),
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="group p-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer"
                    >
                      <Link href={`/groups/${event.groupId}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                              {event.title}
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
                          {event.stats == "Done" && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          )}
                        </div>
                      </Link>
                    </div>
                  ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
