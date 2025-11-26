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
import { selectAllNotifications, setNotifications } from "@/store/slices/notificationSlice";
import { getChatName } from "@/lib/utils";
import { ChatInterface, UserInterface } from "@/lib/interfaces";

export default function ChatApp({ user }: { user: UserInterface | null }) {
  const dispatch = useAppDispatch();
  const chats = useAppSelector(selectAllChats);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const selectedChat: ChatInterface | null = useAppSelector(selectSelectedChat);
  const notifications = useAppSelector(selectAllNotifications);
  const [userStatus, setUserStatus] = useState<string | null>(null);
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

  // Fetch chats and notifications on mount
  useEffect(() => {
    const fetchChats = async () => {
      dispatch(setLoading(true));

      try {
        const response = await authApi.get("/api/chat");
        console.log("Fetched chats:", response.data);
        dispatch(setChats(response.data));
      } catch (error) {
        console.error("Error fetching chats:", error);
        dispatch(setError("Failed to fetch chats"));
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await authApi.get("/api/notification");
        console.log("Fetched notifications:", response.data);
        dispatch(setNotifications(response.data));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchChats();
    fetchNotifications();
  }, [dispatch]);


  // Sync notifications with chats' unseenMsgCount
  useEffect(() => {

    if(notifications.length === 0) {
      //If no notifications, reset unseenMsgCount to 0 for all chats
      dispatch(setChats(chats.map(chat => ({ ...chat, unseenMsgCount: 0 }))));
      return;
    };

    //add the count from the notification to the chat list  unseenMsgCount
    notifications.forEach(notif => {
      dispatch(setChats(chats.map(chat => 
        chat._id === notif.chat._id 
          ? { ...chat, unseenMsgCount: notif.count } 
          : chat
      )));
    });
  }, [notifications]);

  //Creting one to one chat. userId is the id of the user to chat with
  const onAddChat = async (userId: string) => {
    try {
      const response = await authApi.post("/api/chat", { userId });
      dispatch(addChat(response.data)); //Push the new chat to chats array
      dispatch(selectChat(response.data._id)); //Set the selctedChatId
      setShowMobileChat(true);
    } catch (error) {
      console.error("Error creating chat:", error);
      dispatch(setError("Failed to create chat"));
    }
  };

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
              <div className="flex items-center gap-1.5">
                {userStatus === "online" && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
                <p className="text-xs text-muted-foreground">
                  {userStatus && userStatus}
                </p>
              </div>
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

        {!selectedChatId ? (
          //  Chat Window Placeholder
          <div className="flex-1 flex flex-col items-center justify-center bg-background/50 text-muted-foreground p-4 md:p-6">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <h2 className="text-lg font-semibold mb-2">
                Select a chat to start messaging
              </h2>
              <p className="text-sm">Your conversations will appear here.</p>
            </motion.div>
          </div>
        ) : (
          <ChatWindow selectedChatId={selectedChatId} user={user} setUserStatus={setUserStatus} />
        )}

     
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
