"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star, MoreVertical, Loader2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { getUserInfo } from "@/helpers/authHelpers";
import { useRouter } from "next/navigation";

export default function PeoplePage() {
  const user = getUserInfo();
  const router = useRouter();

  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/RatingComment/get-all-user", {
          params: {
            userId: user?.sid,
          },
        });
        const data = res.data?.data || res.data || [];
        setUsersList(data);
      } catch (error) {
        console.error("Failed fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.sid]);

  const filteredUsers = usersList.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.emailMember?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] p-4 sm:p-6 lg:p-8 gap-6 overflow-hidden">
        <div className="flex-none">
          <h1 className="text-3xl font-bold text-foreground">
            People Directory
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and connect with People
          </p>
        </div>

        <Card className="flex flex-col flex-1 min-h-0 overflow-hidden p-4 lg:p-6">
          <div className="flex flex-col h-full gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-none">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 min-h-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 h-full">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Loading users...
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex items-center justify-center py-20 h-full">
                  <p className="text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg border border-border/50">
                    No users found
                  </p>
                </div>
              ) : (
                filteredUsers.map((member: any) => (
                  <div
                    key={member.id}
                    onClick={() => router.push(`/people/${member.id}`)}
                    className={`flex items-center justify-between p-4 border border-border rounded-xl transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-muted/30
                      ${member.id === user?.sid ? "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30" : ""}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-10 w-10 flex-none">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {member.name
                            ? member.name.substring(0, 2).toUpperCase()
                            : "PE"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {member.name}
                          </p>
                          <span className="text-xs text-muted-foreground/80 truncate max-w-[150px] sm:max-w-none">
                            ({member.emailMember})
                          </span>

                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 flex items-center gap-1 flex-none"
                          >
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            {member.rating || "0.0"}
                          </Badge>

                          {(member.role?.toLowerCase() === "admin" ||
                            member.role?.toLowerCase() === "owner") && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-600 border-green-500/20 flex items-center gap-1 flex-none"
                            >
                              Leader
                            </Badge>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          Joined {member.groupsJoined || 0} groups
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
