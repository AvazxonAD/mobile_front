"use client";

import { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import { Input } from "../ui/input";
import { fetchUsers, type User, createChat } from "../../lib/api-service";
import { removeUndefined } from "../../lib/utils";
import { BASE_URL } from "../../lib/API";

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: () => void;
}

export default function UsersModal({
  isOpen,
  onClose,
  onChatCreated,
}: UsersModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setIsLoading(true);
    const fetchedUsers = await fetchUsers();
    setUsers(fetchedUsers);
    setIsLoading(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChat = async (userId: number) => {
    setIsCreating(userId);
    const chat = await createChat(userId);
    setIsCreating(null);

    if (chat) {
      onChatCreated();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-96 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Start New Chat</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleCreateChat(user.id)}
                  disabled={isCreating === user.id}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left disabled:opacity-50"
                >
                  <img
                    src={
                      user.avatar
                        ? BASE_URL +
                          "/users/file/" +
                          removeUndefined(user.avatar)
                        : "/user.png"
                    }
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  {isCreating === user.id && (
                    <Loader className="h-4 w-4 animate-spin flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
