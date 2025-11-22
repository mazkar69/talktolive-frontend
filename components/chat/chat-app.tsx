"use client";
import { io, Socket } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import ChatSidebar from "./chat-sidebar";
import ChatWindow from "./chat-window";
import ThemeToggle from "@/components/theme-toggle";
import VideoCallModal from "./video-call-modal";
import NotificationsDropdown from "./notifications-dropdown";
import SettingsModal from "./settings-modal";
import ConnectionStatus from "./connection-status";
import { authApi } from "@/lib/apiRequest";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setChats,
  selectAllChats,
  selectSelectedChatId,
  selectChat,
  addChat,
  setLoading,
  setError,
  selectSelectedChat,
} from "@/store/slices/chatsSlice";
import { setConnected, setConnectionError, selectIsActive } from "@/store/slices/socketSlice";
import { getChatName } from "@/lib/utils";
import { ChatInterface, UserInterface } from "@/lib/interfaces";

export default function ChatApp({user}: {user: UserInterface | null}) {

  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectAllChats);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const selectedChat:ChatInterface | null = useAppSelector(selectSelectedChat);
  const isActive = useAppSelector(selectIsActive);
  
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "👤",
    hideFromSearch: false,
  });

  const handleSelectChat = (id: string) => {
    dispatch(selectChat(id));
    setShowMobileChat(true);
  };


  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  useEffect(() => {
    const fetchChats = async () => {
      dispatch(setLoading(true));
      
      try {
        const response = await authApi.get("/api/chat");
        dispatch(setChats(response.data));
      } catch (error) {
        console.error("Error fetching chats:", error);
        dispatch(setError("Failed to fetch chats"));
      }
    };

    fetchChats();
  }, [dispatch]);


  //Creting one to one chat. userId is the id of the user to chat with
  const onAddChat = async(userId: string) => {
    try {
      const response = await authApi.post("/api/chat", { userId });
      dispatch(addChat(response.data));             //Push the new chat to chats array
      dispatch(selectChat(response.data._id));      //Set the selctedChatId
      setShowMobileChat(true);                    

    } catch (error) {
      console.error("Error creating chat:", error);
      dispatch(setError("Failed to create chat"));
    }
   
  }

  // -------------SocketIO Setup-------------
  useEffect(() => {

    if(!user?._id || !isActive) {
      // Disconnect socket if user is not active
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        dispatch(setConnected(false));
      }
      return;
    };


    const domain = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    const token = user.token;
    
    const socket = io(domain, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socketRef.current = socket;
    
    socket.emit("setup", user);

    socket.on("connected", () => {
      console.log("Connected to Socket.IO server");
      dispatch(setConnected(true));
      dispatch(setConnectionError(null));
    });

    socket.on("newMessage", (message) => {
      console.log("New message received:", message);
      // Here you can dispatch an action to add the message to the store
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.IO server:", reason);
      dispatch(setConnected(false));
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      dispatch(setConnected(false));
      dispatch(setConnectionError(error.message));
    });

    return () => {
      socket.disconnect();
      dispatch(setConnected(false));
    };

  }, [user, isActive, dispatch]);
  //When the isActive becomes false, disconnect the socket, and in true connect the socket.
  // ----------------------------------------

// console.log("selectedChat:",  selectedChat);

  return (
    <div className="flex min-h-screen max-h-screen bg-background text-foreground border-2 border-red-600">
      
      <div className="hidden md:flex md:flex-col ">
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onAddChat={onAddChat}
        />
      </div>

      <div
        className={`md:hidden w-full ${
          showMobileChat ? "hidden" : "flex flex-col"
        }`}
      >
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onAddChat={onAddChat}
        />
      </div>

      <div
        className={`flex-1 flex flex-col  ${
          !showMobileChat && "hidden md:flex"
        }`}
      >
        <motion.header
          className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToList}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
              title="Back to chats"
            >
              ←
            </motion.button>
            <div className="hidden md:flex items-center gap-2">
              {/* <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                TalkToLive
              </span> */}
            </div>
            {/* <span className="text-2xl">{chats.find(c => c._id === selectedChatId)?.avatar}</span> */}
            <div className="min-w-0">
              <h2 className="font-semibold text-sm md:text-base truncate">
                {getChatName(selectedChat)} 
              </h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <ConnectionStatus />
            <NotificationsDropdown />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVideoCall(true)}
              className="p-2 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
              title="Start video call"
            >
              📹
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title="Settings"
            >
              ⚙️
            </motion.button>
            <ThemeToggle />
          </div>
        </motion.header>

        <ChatWindow selectedChatId={selectedChatId} />
      </div>

      {showVideoCall && (
        <VideoCallModal onClose={() => setShowVideoCall(false)} />
      )}

      {showSettings && (
        <SettingsModal
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
