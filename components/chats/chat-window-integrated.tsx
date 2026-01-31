"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  fetchMessages,
  sendMessage,
  type Message,
  type Chat,
  getCurrentUserId,
} from "../../lib/api-service";
import { removeApiBaseUrll } from "../../lib/utils";
import { BASE_URL } from "../../lib/API";

interface ChatWindowIntegratedProps {
  chat?: any;
  onMenuClick: () => void;
  showBackButton?: boolean;
}

export default function ChatWindowIntegrated({
  chat,
  onMenuClick,
  showBackButton = true,
}: ChatWindowIntegratedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Local user ID (from localStorage or API util)
  const [localUserId, setLocalUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    setLocalUserId(storedUserId);
  }, []);

  useEffect(() => {
    if (chat) {
      loadMessages();
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    if (!chat) return;
    setIsLoading(true);
    const fetchedMessages = await fetchMessages(chat.id);

    // Sort by created_at for correct chronological order
    const sortedMessages = [...fetchedMessages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    setMessages(sortedMessages);
    setIsLoading(false);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chat) return;
    const messageContent = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    const newMessage = await sendMessage(chat.id, messageContent);
    if (newMessage) {
      setMessages((prev) =>
        [...prev, newMessage].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )
      );
    }

    setIsSending(false);
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-sm">Select a chat to start</p>
      </div>
    );
  }

  const currentUserId = localUserId || getCurrentUserId();

  return (
    <div className="flex flex-col min-h-[calc(100vh-130px)] bg-background min-w-0 w-full md:w-auto">
      {/* Header */}
      <div className="border-b flex gap-2 items-center border-border bg-card px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
        {showBackButton && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            aria-label="Back to chats"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={
              chat.user_avatar
                ? chat.user_avatar
                : "/user.png"
            }
            alt=""
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm sm:text-base truncate">
              {chat.user_name}
            </h2>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col p-3 sm:p-4 space-y-3 sm:space-y-4 justify-end">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet
          </div>
        ) : (
          <>
            {messages.map((message: any) => {
              const isOwnMessage = message.user_id == currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs sm:max-w-sm rounded-xl px-2 sm:px-2 py-1 text-sm break-words shadow-sm ${
                      isOwnMessage
                        ? "bg-blue-500 text-white rounded-br-none "
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <div>{message.content}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 text-right">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="border-t border-border bg-card p-3 sm:p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isSending}
            className="flex-1 text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isSending || !inputValue.trim()}
            className="gap-2 bg-blue-500 text-white hover:bg-blue-600 px-3 sm:px-4 flex-shrink-0"
            size="sm"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
