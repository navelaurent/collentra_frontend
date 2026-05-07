"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { ReusableModal } from "../reusableModal";
import { getUserInfo } from "@/helpers/authHelpers";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export const InviteMemberModal = ({
  isOpen,
  onClose,
  groupId,
  onSuccess,
  onFailed,
}: InviteMemberModalProps) => {
  const user = getUserInfo();
  const [emailInput, setEmailInput] = useState("");
  const [userSuggestions, setUserSuggestions] = useState<any[]>([]);
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const searchUser = async () => {
      if (emailInput.length < 2) {
        setUserSuggestions([]);
        return;
      }
      setIsSearchingUser(true);
      try {
        const response = await api.get("/Invitation/search", {
          params: { email: emailInput },
        });
        setUserSuggestions(response.data.data || []);
      } catch {
      } finally {
        setIsSearchingUser(false);
      }
    };
    const debounce = setTimeout(searchUser, 500);
    return () => clearTimeout(debounce);
  }, [emailInput]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post(
        `/Invitation/send-invite/${groupId}`,
        JSON.stringify(emailInput),
        {
          params: {
            invitedByUserId: user?.sid,
          },
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const successMsg = res.data?.message || "Successfully add this email";
      onSuccess(successMsg);
      onClose();
      setEmailInput("");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Server erorr !";
      onFailed(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableModal isOpen={isOpen} onClose={onClose} title="Invite Member">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-gray-300">
            User Email
          </label>
          <div className="relative">
            <Input
              required
              placeholder="search by email..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:ring-purple-500/50"
            />
            {isSearchingUser && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-gray-500" />
            )}
          </div>
          {userSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl max-h-40 overflow-auto">
              {userSuggestions.map((u) => (
                <div
                  key={u.id}
                  className="px-4 py-2 hover:bg-white/5 cursor-pointer text-sm text-gray-300"
                  onClick={() => {
                    setEmailInput(u.email);
                    setUserSuggestions([]);
                  }}
                >
                  {u.name} ({u.email})
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-gray-400"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Send Invite
              </>
            )}
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};
