"use client";

import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileText, Download, Paperclip, Send, ChevronUp } from "lucide-react";
import api from "@/lib/axios";
import { useAlert } from "@/components/ui/showAlert";

interface SharedDocumentsTabProps {
  groupId: string;
  user: any;
  tasks: any[];
}

const getDayLabel = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();

  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const dateMidnight = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = todayMidnight.getTime() - dateMidnight.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }
};

const formatTimeOnly = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function SharedDocumentsTab({
  groupId,
  user,
  tasks,
}: SharedDocumentsTabProps) {
  const { showAlert } = useAlert();

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [groupedDocuments, setGroupedDocuments] = useState<{
    [key: string]: any[];
  }>({});

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);

  const groupDocumentsByDate = (docs: any[]) => {
    const grouped = docs.reduce((acc: { [key: string]: any[] }, doc) => {
      const label = getDayLabel(doc.createdAt);
      if (!acc[label]) {
        acc[label] = [];
      }
      acc[label].push(doc);
      return acc;
    }, {});

    return grouped;
  };

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/FileUpload", {
        params: { groupId: groupId },
      });

      if (response.data.data) {
        const grouped = groupDocumentsByDate(response.data.data);
        setGroupedDocuments(grouped);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchDocuments();
    }
  }, [groupId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [groupedDocuments]);

  const handleUpload = async () => {
    if (!selectedFile) {
      showAlert("Please choose your file!", "error");
      return;
    }

    const formUploadFile = new FormData();
    formUploadFile.append("GroupId", groupId);
    formUploadFile.append("SenderId", user?.sid);
    formUploadFile.append("TaskId", selectedTaskId);
    formUploadFile.append("File", selectedFile);

    if (selectedTaskId) {
      formUploadFile.append("TaskId", selectedTaskId);
    }

    setIsUploading(true);
    try {
      const response = await api.post(
        "/FileUpload/upload-file",
        formUploadFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data?.status || response.status === 200) {
        showAlert("File uploaded successfully!", "success");
        setSelectedFile(null);
        setSelectedTaskId("");
        fetchDocuments();
      } else {
        showAlert("Failed upload File !", "error");
      }
    } catch (error) {
      showAlert("Server Error !", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const localUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = localUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(localUrl);
    } catch (error) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", fileName);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const dateLabels = Object.keys(groupedDocuments);

  const selectedTaskName =
    tasks?.find((t: any) => t.id === selectedTaskId)?.name ||
    tasks?.find((t: any) => t.id === selectedTaskId)?.title ||
    "Select Task";

  return (
    <Card className="p-0 flex flex-col h-[500px] overflow-hidden">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground">Shared Documents</h3>
        <p className="text-xs text-muted-foreground">
          Share and download group files
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {dateLabels.length > 0 ? (
          dateLabels.map((label) => (
            <div key={label} className="space-y-4">
              <div className="flex justify-center">
                <span className="bg-muted/80 text-muted-foreground text-[11px] font-medium px-3 py-1 rounded-full border border-border/50 shadow-sm">
                  {label}
                </span>
              </div>

              {groupedDocuments[label].map((doc: any) => {
                const isMine = doc.senderId === user?.sid;
                const initial = doc.senderName
                  ? doc.senderName.charAt(0).toUpperCase()
                  : "?";

                return (
                  <div
                    key={doc.id}
                    className={`flex items-start gap-3 ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMine && (
                      <Avatar className="h-8 w-8 shrink-0 mt-5">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                        isMine ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-xs text-muted-foreground mb-1 px-1">
                        {isMine ? "You" : doc.senderName}
                      </span>

                      <div
                        className={`p-3 rounded-2xl flex items-center gap-3 ${
                          isMine
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${
                            isMine
                              ? "bg-primary-foreground/20"
                              : "bg-background"
                          }`}
                        >
                          <FileText className="h-5 w-5" />
                        </div>

                        <div className="flex flex-col overflow-hidden pr-2">
                          <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-[200px]">
                            {doc.fileName}
                          </span>
                          <span className="text-[11px] opacity-70 mt-0.5">
                            {doc.fileSize || "Unknown Size"} •{" "}
                            {formatTimeOnly(doc.createdAt)}
                          </span>
                        </div>

                        <Button
                          variant={isMine ? "secondary" : "ghost"}
                          size="icon"
                          className={`h-8 w-8 rounded-full shrink-0 transition-colors ${
                            isMine
                              ? "hover:bg-primary-foreground/20"
                              : "hover:bg-muted-foreground/20 bg-background/50"
                          }`}
                          onClick={() =>
                            handleDownload(doc.filePath, doc.fileName)
                          }
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {isMine && (
                      <Avatar className="h-8 w-8 shrink-0 mt-5">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            No documents shared yet.
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t border-border bg-card shadow-sm z-10 relative">
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTaskMenuOpen(!isTaskMenuOpen)}
              className="flex items-center justify-between gap-2 px-3 py-2.5 border border-border rounded-lg text-sm text-muted-foreground bg-background hover:bg-muted/50 transition-colors w-[130px] sm:w-[150px]"
            >
              <span className="truncate">{selectedTaskName}</span>
              <ChevronUp
                className={`h-4 w-4 shrink-0 transition-transform ${isTaskMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isTaskMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] max-h-[200px] overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-50 flex flex-col py-1">
                {tasks &&
                tasks.filter((task: any) => task.assigneeId === user?.sid)
                  .length > 0 ? (
                  tasks
                    .filter(
                      (task: any) =>
                        task.assigneeId === user?.sid &&
                        task.status === "InProgress",
                    )
                    .map((task: any) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setIsTaskMenuOpen(false);
                        }}
                        className="text-left px-3 py-2 text-sm hover:bg-muted transition-colors text-foreground"
                      >
                        {task.name || task.title || "Unnamed Task"}
                      </button>
                    ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No tasks assigned to you
                  </div>
                )}
              </div>
            )}
          </div>

          <input
            type="file"
            className="hidden"
            id="file-upload"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />
          <label htmlFor="file-upload" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2 w-full px-4 py-2.5 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
              <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground truncate">
                {selectedFile ? selectedFile.name : "Select a File to share..."}
              </span>
            </div>
          </label>
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !selectedTaskId}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isUploading ? "Sending..." : "Send"}
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}
