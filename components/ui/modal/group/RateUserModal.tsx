"use client";

import React, { useState } from "react";
import { Loader2, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReusableModal } from "../reusableModal";
import api from "@/lib/axios";

interface RateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  userId: string;
  targetUserId?: string;
  targetUserName?: string;
  targetUserEmail?: string;
  onSuccess: (message: string) => void;
  onFailed: (message: string) => void;
}

export const RateUserModal = ({
  isOpen,
  onClose,
  userId,
  targetUserId,
  targetUserName,
  targetUserEmail,
  groupId,
  groupName,
  onSuccess,
  onFailed,
}: RateUserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      onFailed("Mohon berikan rating minimal 1 bintang.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(
        "/RatingComment/rate-person",
        {
          groupId: groupId,
          rate: rating,
          comment: comment,
          targetId: targetUserId,
        },
        {
          params: {
            userId: userId,
          },
        },
      );

      const successMsg = res.data?.message || "Rating berhasil dikirim!";
      onSuccess(successMsg);

      setRating(0);
      setComment("");
      onClose();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Terjadi kesalahan pada server!";
      onFailed(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Team Member"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-sm text-gray-400">Group</span>
            <span className="text-sm font-medium text-purple-400">
              {groupName}
            </span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-sm text-gray-400">Member</span>
            <div className="text-right">
              <p className="text-sm font-medium text-white">{targetUserName}</p>
              <p className="text-xs text-gray-400">{targetUserEmail}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 flex flex-col items-center justify-center pt-2">
          <label className="text-sm font-medium text-gray-300">
            Give Rating (0 - 5)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-600"
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400">
            {rating > 0 ? `${rating} / 5 Stars` : "Choose Stars"}
          </span>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Comments / Feedback
          </label>
          <textarea
            placeholder={`Send a Comments for ${targetUserName}...`}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:ring-1 focus:ring-purple-500/50 resize-y"
          />
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 text-gray-400 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Rating
              </>
            )}
          </Button>
        </div>
      </form>
    </ReusableModal>
  );
};
