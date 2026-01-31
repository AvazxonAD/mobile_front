"use client";

import { useState, useEffect } from "react";

import { fetchChats, type Chat } from "../../../lib/api-service";
import ChatListIntegrated from "../../../components/chats/chat-list-integrated";
import ChatWindowIntegrated from "../../../components/chats/chat-window-integrated";
import UsersModal from "../../../components/chats/users-modal";
import { MobileHeader } from "../../../components/layout/mobile-header";
import { MobileNav } from "../../../components/layout/mobile-nav";

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if token exists before loading
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setIsInitialized(true);
      return;
    }

    loadChats();
    setIsInitialized(true);
  }, []);

  const loadChats = async () => {
    setIsLoadingChats(true);
    const fetchedChats = await fetchChats();
  
    setChats(fetchedChats);
    setIsLoadingChats(false);
  };

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const handleNewChat = () => {
    setShowUsersModal(true);
  };

  const handleChatCreated = () => {
    loadChats();
  };

  const handleBackToChats = () => {
    setSelectedChatId(null);
  };

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="text-center">
          <p className="text-foreground font-semibold mb-2">
            Authentication Required
          </p>
          <p className="text-sm text-muted-foreground">
            Please set your auth token in the browser console:
          </p>
          <code className="block mt-3 p-3 bg-muted rounded text-xs text-left">
            localStorage.setItem('token', 'YOUR_TOKEN_HERE')
          </code>
          <p className="text-xs text-muted-foreground mt-3">
            Then refresh the page
          </p>
        </div>
      </div>
    );
  }

  const showChatWindow = selectedChatId !== null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="flex">
        {/* Chat List - hidden on mobile when chat window is open, visible by default */}
        <div
          className={`${
            showChatWindow ? "hidden md:flex md:w-64" : "flex w-full md:w-64"
          } flex-col`}
        >
          <ChatListIntegrated
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={(id) => setSelectedChatId(id)}
            onNewChat={handleNewChat}
            showMobile={true}
            onCloseMobile={() => {}}
            isLoading={isLoadingChats}
          />
        </div>

        {/* Chat Window - hidden on mobile unless chat is selected, always visible on desktop */}
        {showChatWindow && (
          <div className="flex flex-1 flex-col md:flex md:flex-col">
            <ChatWindowIntegrated
              chat={selectedChat}
              onMenuClick={handleBackToChats}
              showBackButton={true}
            />
          </div>
        )}

        <UsersModal
          isOpen={showUsersModal}
          onClose={() => setShowUsersModal(false)}
          onChatCreated={handleChatCreated}
        />
      </main>
      <MobileNav />
    </div>
  );
}
