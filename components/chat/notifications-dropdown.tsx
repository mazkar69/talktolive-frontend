"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectAllNotifications,
  selectTotalNotificationCount,
  clearNotifications,
} from "@/store/slices/notificationSlice";
import { getChatName } from "@/lib/utils";
import { selectChat } from "@/store/slices/chatsSlice";


export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectAllNotifications);
  const totalCount = useAppSelector(selectTotalNotificationCount);

  const handleNotificationClick = async (chatId: string) => {
    try {
      dispatch(selectChat(chatId));
      setIsOpen(false);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  const handleMarkAllAsRead = () => {
    dispatch(clearNotifications());
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-accent transition-colors"
        title="Notifications"
      >
        🔔
        {totalCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs text-white font-bold"
          >
            {totalCount > 99 ? "99+" : totalCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-12 w-80 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                <h3 className="font-semibold">Notifications</h3>
                {totalCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Clear all
                  </motion.button>
                )}
              </div>

              <div className="divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.chat._id}
                      whileHover={{ backgroundColor: "var(--color-accent)" }}
                      className="p-4 cursor-pointer transition-colors bg-accent/20 hover:bg-accent/30"
                      onClick={() =>
                        handleNotificationClick(notification.chat._id)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {getChatName(notification.chat)}
                        </p>
                        <span className="text-xs font-semibold bg-destructive text-white rounded-full px-2 py-0.5">
                          {notification.count}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.count} new{" "}
                        {notification.count === 1 ? "message" : "messages"}
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
