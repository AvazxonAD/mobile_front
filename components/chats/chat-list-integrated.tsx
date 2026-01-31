"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { type Chat, getCurrentUserId } from "../../lib/api-service";
import { removeApiBaseUrll } from "../../lib/utils";
import { BASE_URL } from "../../lib/API";

interface ChatListIntegratedProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (id: number) => void;
  onNewChat: () => void;
  showMobile: boolean;
  onCloseMobile: () => void;
  isLoading?: boolean;
}

export default function ChatListIntegrated({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  showMobile,
  onCloseMobile,
  isLoading = false,
}: ChatListIntegratedProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const currentUserId = localStorage.getItem("userId");
  const filteredChats = chats.filter((chat) => {
    const otherUserName =
      chat.sender_id.toString() == currentUserId
        ? chat.receiver_name
        : chat.sender_name;
    return otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedChats = [...filteredChats].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  const getTimeString = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getOtherUserInfo = (chat: Chat) => {
    if (chat.sender_id.toString() == currentUserId) {
      return {
        name: chat.receiver_name,
        avatar: "",
      };
    } else {
      return {
        name: chat.sender_name,
        avatar: "",
      };
    }
  };

  return (
    <>
      {showMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
        fixed md:relative
        left-0 top-0 bottom-0
        w-full md:w-auto h-screen md:h-auto
        flex flex-col border-r border-border bg-card
        transition-transform duration-300 ease-in-out
        z-50 md:z-auto
        ${showMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div className="border-b border-border p-3 sm:p-4 mt-10 md:mt-0">
          <Button
            onClick={onNewChat}
            className="w-full gap-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="border-b border-border p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
              Loading...
            </div>
          ) : sortedChats.length === 0 ? (
            <div className="flex items-center justify-center p-4 text-center text-muted-foreground text-sm">
              No chats yet. Start a new chat!
            </div>
          ) : (
            <div className="space-y-1 p-2 sm:p-3">
              {sortedChats.map((chat: any) => {
                const otherUser = getOtherUserInfo(chat);
                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat.id)}
                    className={`w-full flex items-center gap-2.5 rounded-lg p-2.5 sm:p-3 transition-colors text-left ${
                      selectedChatId === chat.id
                        ? "bg-blue-100 text-blue-900"
                        : "hover:bg-gray-100 text-foreground"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={chat.user_avatar ? chat.user_avatar : "/user.png"}
                        alt=""
                      />

                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-sm truncate">
                          {chat.user_name}
                        </h3>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {getTimeString(chat.updated_at)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        Chat opened
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
