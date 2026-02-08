"use client";

import { useState } from "react";
import Image from "next/image";
import { getEmojiSrc, getEmojiLabel } from "@/lib/emojiConstants";

interface ReactionUser {
  userId: number;
  username: string;
}

interface ReactionBadgeProps {
  emoji: string;
  count: number;
  users: ReactionUser[];
  isReactedByCurrentUser: boolean;
  onClick: () => void;
}

const ReactionBadge = ({ emoji, count, users, isReactedByCurrentUser, onClick }: ReactionBadgeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const emojiSrc = getEmojiSrc(emoji);
  const emojiLabel = getEmojiLabel(emoji);

  if (!emojiSrc) return null;

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors ${
          isReactedByCurrentUser
            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-tertiary dark:text-gray-400 dark:hover:bg-gray-600"
        }`}
      >
        <Image
          src={emojiSrc}
          alt={emojiLabel || emoji}
          width={16}
          height={16}
          className="h-4 w-4 rounded object-cover"
        />
        <span>{count}</span>
      </button>
      
      {/* Tooltip showing usernames */}
      {showTooltip && users.length > 0 && (
        <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-gray-700">
          {users.map(u => u.username).join(", ")}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
};

export default ReactionBadge;
