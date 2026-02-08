"use client";

import { useState, useMemo, useRef } from "react";
import { Smile } from "lucide-react";
import EmojiPicker from "@/components/EmojiPicker";
import ReactionBadge from "@/components/ReactionBadge";
import { CommentReaction, GroupedReaction, useToggleReactionMutation } from "@/state/api";

interface CommentReactionsProps {
  commentId: number;
  reactions: CommentReaction[];
  currentUserId: number | undefined;
}

const CommentReactions = ({ commentId, reactions, currentUserId }: CommentReactionsProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [toggleReaction] = useToggleReactionMutation();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Group reactions by emoji and sort by count descending (Requirement 2.5)
  const groupedReactions = useMemo((): GroupedReaction[] => {
    const groups: Record<string, { users: { userId: number; username: string }[] }> = {};
    
    for (const reaction of reactions) {
      if (!groups[reaction.emoji]) {
        groups[reaction.emoji] = { users: [] };
      }
      if (reaction.user) {
        groups[reaction.emoji].users.push({
          userId: reaction.userId,
          username: reaction.user.username,
        });
      }
    }

    return Object.entries(groups)
      .map(([emoji, data]) => ({
        emoji,
        count: data.users.length,
        users: data.users,
        reactedByCurrentUser: currentUserId 
          ? data.users.some(u => u.userId === currentUserId)
          : false,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  }, [reactions, currentUserId]);

  const handleToggleReaction = async (emoji: string) => {
    if (!currentUserId) return;
    await toggleReaction({ commentId, userId: currentUserId, emoji });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      {/* Existing reaction badges */}
      {groupedReactions.map((group) => (
        <ReactionBadge
          key={group.emoji}
          emoji={group.emoji}
          count={group.count}
          users={group.users}
          isReactedByCurrentUser={group.reactedByCurrentUser}
          onClick={() => handleToggleReaction(group.emoji)}
        />
      ))}
      
      {/* Add reaction button */}
      <div className="relative">
        <button
          ref={triggerRef}
          onClick={() => setShowPicker(!showPicker)}
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-tertiary dark:hover:text-gray-300"
          title="Add reaction"
        >
          <Smile size={14} />
        </button>
        
        {showPicker && (
          <EmojiPicker
            onSelect={handleToggleReaction}
            onClose={() => setShowPicker(false)}
            triggerRef={triggerRef}
          />
        )}
      </div>
    </div>
  );
};

export default CommentReactions;
