"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectMatchedUser,
  addRandomMessage,
  endChat,
} from "@/store/slices/randomTalkSlice";
import { selectUser } from "@/store/slices/userSlice";
import { useSocket } from "@/app/socketProvider";
import MessageBubble from "./message-bubble";
import { MessageInterface } from "@/lib/interfaces";
import { set } from "date-fns";
import { is } from "date-fns/locale";

export default function RandomChatWindow() {
  const dispatch = useAppDispatch();
  const { emit, socket } = useSocket();
  const user = useAppSelector(selectUser);
  const matchedUser = useAppSelector(selectMatchedUser);
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //useEffect to listen for incoming messages from socket.
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (data: MessageInterface) => {
      const newMessage: MessageInterface = {
        _id: Date.now().toString(),
        message: data.message,
        sender: data.sender,
        createdAt: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("randomTalkMessage", handleIncomingMessage);
    socket.on("randomTalkEnded", ({ endedBy, reason }) => {
      dispatch(endChat());
    });
    socket.on("randomTalkTyping", ({ senderId, isTyping }) => {
      setIsTyping(isTyping);
    });

    return () => {
      // Cleanup if needed
      socket.off("randomTalkMessage", handleIncomingMessage);
      socket.off("randomTalkEnded");
      socket.off("randomTalkTyping");
    };
  }, []);


//Handle Input Change send typing event to socket
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingEmittedRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (!socket) return;

    // Emit typing event only once when user starts typing
    if (!isTypingEmittedRef.current) {
      emit("randomTalkTyping", {senderId: user?._id, recipientId: matchedUser?._id, isTyping: true });
      isTypingEmittedRef.current = true;
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emit("randomTalkTyping", {senderId: user?._id, recipientId: matchedUser?._id, isTyping: false });
      isTypingEmittedRef.current = false;
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !matchedUser || !user) return;

    // Emit stop typing event
    emit("randomTalkTyping", {senderId: user?._id, recipientId: matchedUser?._id, isTyping: false });

    const newMessage: MessageInterface = {
      _id: Date.now().toString(),
      message: inputMessage,
      sender: user,
      createdAt: new Date().toISOString(),
    };

    // Add to local state
    dispatch(addRandomMessage(newMessage));

    // Emit to server (API placeholder)
    emit("randomTalkMessage", {
      message: inputMessage,
      recipientId: matchedUser._id,
    });

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
  };

  const handleEndChat = () => {
    // Emit end chat event (API placeholder)
    emit("endRandomTalk", { userId: user?._id, partnerId: matchedUser?._id });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {matchedUser?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-base">
              {matchedUser?.name || "Stranger"}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Random Talk
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEndChat}
          className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive/20 transition-colors border border-destructive/30"
        >
          End Chat
        </motion.button>
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground">
            <span className="text-lg">🎲</span>
            You're now chatting with a random stranger
          </div>
        </motion.div>

        {/* Messages */}
        <AnimatePresence>
          {messages.map((message, i) => (
            <MessageBubble key={i} message={message} user={user} />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-muted-foreground text-sm"
          >
            <span>{matchedUser?.name} is typing</span>
            <span className="flex gap-1">
              <span
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-t border-border p-4 md:p-6 bg-card"
      >
        <div className="flex gap-2 md:gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-3 bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm md:text-base"
              rows={1}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            Send
          </motion.button>
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          ⚠️ This chat won't be saved. Be respectful and have fun!
        </p>
      </motion.div>
    </div>
  );
}
