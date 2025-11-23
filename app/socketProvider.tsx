"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setConnected,
  setConnectionError,
  selectIsActive,
} from "@/store/slices/socketSlice";
import { selectUser } from "@/store/slices/userSlice";
import { selectSelectedChatId, updateLatestMessage } from "@/store/slices/chatsSlice";
import { addNotification } from "@/store/slices/notificationSlice";

interface SocketContextType {
  socket: Socket | null;
  emit: (event: string, ...args: any[]) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  emit: () => {},
});

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const selectedChatId = useAppSelector(selectSelectedChatId);
  const isActive = useAppSelector(selectIsActive);

  useEffect(() => {
    if (!user?._id || !isActive) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        dispatch(setConnected(false));
      }
      return;
    }

    const domain =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
    const token = user.token;

    const newSocket = io(domain, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.emit("setup", user);

    newSocket.on("connected", () => {
      console.log("Connected to Socket.IO server");
      dispatch(setConnected(true));
      dispatch(setConnectionError(null));
    });

    newSocket.on("newMessage", (newMessage) => {
      console.log("New message received in socketProvider:", newMessage);

      //This will update the lastMessageId in user chat.
      newSocket.emit("messageReceivedAck", { messageId: newMessage._id });

      //Update the latestMessage and move chat to top
      dispatch(updateLatestMessage({ message: newMessage }));

      //Push the notification if the message is not for the current chat
      console.log("Selected Chat ID:", selectedChatId);
      console.log("New Message Chat ID:", newMessage.chat);
      if (newMessage.chat != selectedChatId) {
        // Add to notifications
        newSocket.emit("addNotification", {
          recipient: user._id,
          message: newMessage,
          chat: newMessage.chat,
        });
        return;
      }
    });

    newSocket.on("newNotification", (notification) => {
      console.log("New notification received in socketProvider:", notification);
      // Add to notifications
      dispatch(addNotification(notification));
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Disconnected from Socket.IO server:", reason);
      dispatch(setConnected(false));
      if (reason === "io server disconnect") {
        newSocket.connect();
      }
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      dispatch(setConnected(false));
      dispatch(setConnectionError(error.message));
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      dispatch(setConnected(false));
    };
  }, [user, isActive, dispatch]);

  // Helper to safely emit events
  const emit = (event: string, ...args: any[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, ...args);
    } else {
      console.warn(`Cannot emit "${event}": Socket not connected`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, emit }}>
      {children}
    </SocketContext.Provider>
  );
}
