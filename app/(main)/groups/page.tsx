"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { GroupCard } from "@/components/groups/GroupCard";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { CreateGroupModal } from "@/components/ui/modal/group/createGroupModal";
import api from "@/lib/axios";
import { getUserInfo } from "@/helpers/authHelpers";
import { useAlert } from "@/components/ui/showAlert";

export default function GroupsPage() {
  const user = getUserInfo();
  const { showAlert } = useAlert();

  const [groups, setGroups] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGroups = async () => {
    if (!user?.sid) return;

    setIsLoading(true);
    try {
      const response = await api.get("/Group", {
        params: {
          userId: user?.sid,
        },
      });

      if (response.data.message === "Success") {
        setGroups(response.data.data || []);
      }
    } catch (error: any) {
      showAlert("Gagal mengambil data grup", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredGroups = (groups || []).filter((group) => {
    const name = (group?.groupName ?? "").toLowerCase();
    const desc = (group?.description ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) || desc.includes(query);
  });

  const handleCreateGroup = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await api.post("/Group/create-group", {
        name: data.name,
        userId: user?.sid,
        description: data.description,
        IsArchived: false,
      });

      if (response.data.status) {
        showAlert(response.data.message, "success");
        setIsModalOpen(false);
        fetchGroups();
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal membuat grup";
      showAlert(msg, "error");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user?.sid]);

  return (
    <MainLayout>
      <div className="space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Groups</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your team projects
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Groups Grid & Loading State */}
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full mb-2"></div>
            <p>Loading groups...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.groupId}
                  {...group}
                  id={group.groupId}
                  name={group.groupName}
                  leaderInitials={
                    group.leaderName?.substring(0, 1).toUpperCase() || "?"
                  }
                  tasksTotal={group.taskTotal}
                  tasksCompleted={group.taskComplete}
                  progress={
                    group.taskTotal > 0
                      ? Math.round((group.taskComplete / group.taskTotal) * 100)
                      : 0
                  }
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No groups found</p>
              </div>
            )}
          </>
        )}
      </div>

      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGroup}
      />
    </MainLayout>
  );
}
