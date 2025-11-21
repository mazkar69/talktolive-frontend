"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SearchUsers from "./search-users";
import CreateGroupModal from "./create-group-modal";
import { ChatInterface, UserInterface } from "@/lib/interfaces";
import { getChatImage, getChatName } from "@/lib/utils";

interface ChatSidebarProps {
  chats: ChatInterface[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
  onAddChat: (chat: ChatInterface) => void;
}

export default function ChatSidebar({
  chats,
  selectedChat,
  onSelectChat,
  onAddChat,
}: ChatSidebarProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
    },
  };

  // console.log("Chats:", chats);

  return (
    <div className="w-full md:w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <motion.div
        className="p-4 md:p-6 border-b border-border"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <h1 className="text-xl md:text-2xl font-bold mb-4">Messages</h1>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearch(!showSearch)}
            className="flex-1 px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-accent transition-colors text-left text-sm font-medium"
          >
            + Chat
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateGroup(!showCreateGroup)}
            className="flex-1 px-4 py-2 bg-muted rounded-lg text-muted-foreground hover:bg-accent transition-colors text-left text-sm font-medium"
          >
            + Group
          </motion.button>
        </div>
      </motion.div>

      {/* Search Users Modal */}
      {showSearch && (
        <SearchUsers
          onClose={() => setShowSearch(false)}
          onStartChat={(user) => {
            const newChat: ChatInterface = {
              _id: `user_${Date.now()}`,
              chatName: user.name,
              isGroupChat: false,
              latestMessage: "",
              users: [user],
            };
            onAddChat(newChat);
            onSelectChat(newChat._id);
            setShowSearch(false);
          }}
        />
      )}

      {/* Create Group Modal */}
      {/* {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={(group) => {
            onAddChat(group)
            onSelectChat(group.id)
            setShowCreateGroup(false)
          }}
        />
      )} */}

      {/* Chats List */}
      <motion.div
        className="flex-1 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {chats?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full p-8 text-center"
          >
            <p className="text-muted-foreground text-sm">No chats yet</p>
            <p className="text-muted-foreground text-xs mt-2">
              Start a conversation by clicking + Chat
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={chats.length} // Re-trigger animation when chats array changes
          >
            {chats.map((chat) => (
              <motion.button
                key={chat._id}
                onClick={() => onSelectChat(chat._id)}
                variants={itemVariants}
                className={`w-full p-4 border-b border-border text-left transition-all hover:bg-accent/50 ${
                  selectedChat === chat._id ? "bg-accent" : ""
                }`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-2xl"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <img src={getChatImage(chat)} alt={getChatName(chat)} className="w-10 h-10 rounded-full" />
                  </motion.span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate text-sm md:text-base">
                      {getChatName(chat)}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {chat?.latestMessage}
                    </p>
                  </div>
                  {selectedChat === chat._id && (
                    <motion.div
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      layoutId="chatIndicator"
                      transition={{ type: "spring", stiffness: 200 }}
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
