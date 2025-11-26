"use client";

import { useState, useRef, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./message-bubble";
import TypingIndicator from "./typing-indicator";
import { MessageInterface, UserInterface } from "@/lib/interfaces";
import { authApi } from "@/lib/apiRequest";
import { useSocket } from "@/app/socketProvider";
import { updateLatestMessage } from "@/store/slices/chatsSlice";
import { useAppDispatch } from "@/store/hooks";
import { removeNotification } from "@/store/slices/notificationSlice";

interface ChatWindowProps {
  selectedChatId: string | null;
  user: UserInterface | null;
  setUserStatus: (status: string) => void;
}

export default function ChatWindow({
  selectedChatId,
  user,
  setUserStatus,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const { socket, emit } = useSocket();
  const dispatch = useAppDispatch();

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch messages when selectedChatId changes
  useEffect(() => {
    // Fetch messages for the selected chat from API
    if (!selectedChatId || socket === null) {
      setMessages([]);
      return;
    }

    //Function to fetch messages
    const getMessagesForChat = async () => {
      try {
        setLoading;
        const response = await authApi.get(`/api/message/${selectedChatId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    getMessagesForChat();

    return () => {
      setMessages([]);
    };
  }, [selectedChatId]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //Socket Listeners and Handlers
  useEffect(() => {
    if (!socket || !selectedChatId) return;

    const handleNewMessage = (newMessage: MessageInterface) => {
      // console.log("New message received in chat-window:", newMessage);

      //Message is for different chat, We are handling this is socketProvider.tsx Which will show notification.
      if (newMessage.chat !== selectedChatId) return;

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    //Remove the msg notification for this chat
    const removeNotificationForChat = async () => {
      emit(
        "clearNotifications",
        { chatId: selectedChatId },
        (response: any) => {
          if (response.success) {
            dispatch(removeNotification(selectedChatId));
          }
        }
      );
    };
    removeNotificationForChat();

    //Join the socket room for this chat. We are joining the chat because we want to listen to typeing. and send the typing event to others in the chat. We can do this without joining the chat and sending the event to all the user in loop.  but this is more efficient. When the user is in the chat then only listen to typing event for that chat. In case of chats we want that user receive the message even if he is not in the chat. That's why we are using userId for messages. and for typing we are using chatId. as a room.
    emit("joinChat", selectedChatId);
    emit("getUserStatus", { chatId: selectedChatId }, (response: any) => {
      // console.log("User status response:", response);
      if (response?.status) {
        if (response?.status == "offline") {
          const lastSeen = new Date(response?.lastSeen);
          setUserStatus(`Last seen: ${lastSeen.toLocaleString()}`);
        } else {
          setUserStatus(response?.status);
        }
      }
    });

    socket.on("newMessage", handleNewMessage);
    // Listen for others typing
    socket.on("typing", (data) => {
      if (data.chatId === selectedChatId) {
        // Show "User is typing..." indicator
        setIsTyping(true);
        // Hide the typing indicator after a delay
        // setTimeout(() => {
        //   setIsTyping(false);
        // }, 3000); // Adjust the delay as needed
      }
    });
    socket.on("stopTyping", (data) => {
      if (data.chatId === selectedChatId) {
        // Hide "User is typing..." indicator
        setIsTyping(false);
      }
    });

    socket.on("userStatus", (data) => {
      if(data?.chatId !== selectedChatId) return;
      // console.log("User status update:", data);
      
      if (data?.status == "offline") {
        const lastSeen = new Date(data?.lastSeen);
        //Convert into string and setUserStatus
        setUserStatus(`Last seen: ${lastSeen.toLocaleString()}`);
      } else {
        setUserStatus(data?.status);
      }
    });

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing");
      emit("leaveChat", selectedChatId);
    };
  }, [selectedChatId]);

  //Handle Input Change send typing event to socket
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingEmittedRef = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (!socket || !selectedChatId) return;

    // Emit typing event only once when user starts typing
    if (!isTypingEmittedRef.current) {
      emit("typing", { chatId: selectedChatId });
      isTypingEmittedRef.current = true;
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      emit("stopTyping", { chatId: selectedChatId });
      isTypingEmittedRef.current = false;
    }, 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    if (selectedChatId === null) return; // No chat selected
    if (!user) return; // No user logged in
    if (!socket?.connected) return;

    console.log("Sending message via socket:", inputValue);
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Emit stop typing event
    emit("stopTyping", { chatId: selectedChatId });

    const messageData: MessageInterface = {
      message: inputValue,
      chat: selectedChatId,
      sender: user,
      createdAt: new Date(),
    };

    emit("new message", messageData, (response: any) => {
      //Response is MessageInterface type
      if (response && response._id) {
        console.log("Message delivered with ID:", response._id);

        // const audio = new Audio("/public/sound/message-sent.mp3");
        // audio.play().catch(err => console.error("Audio playback failed:", err));

        //Update the latestMessage and move chat to top
        dispatch(updateLatestMessage({ message: response }));
      } else {
        console.error("Message delivery failed:", response);
      }
    });

    setMessages([...messages, messageData]);
    setInputValue("");
  };

  return (
    <div className="flex-1 flex flex-col bg-background max-h-[calc(100vh-4rem)] ">
      {/* Messages Area with Page Transition */}
      <motion.div
        key={selectedChatId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((message: MessageInterface, i) => (
            <MessageBubble key={i} message={message} user={user} />
          ))}
        </AnimatePresence>

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Input Area */}
      <motion.form
        onSubmit={handleSendMessage}
        className="p-4 md:p-6 border-t border-border flex gap-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.input
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 transition-colors text-sm md:text-base"
          whileFocus={{ scale: 1.01 }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-4 md:px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm md:text-base"
        >
          Send
        </motion.button>
      </motion.form>
    </div>
  );
}
