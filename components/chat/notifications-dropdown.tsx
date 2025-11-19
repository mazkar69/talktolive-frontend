'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Notification {
  id: string
  message: string
  timestamp: string
  read: boolean
}

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', message: 'Sarah sent you a message', timestamp: '2 min ago', read: false },
    { id: '2', message: 'Michael added you to Design Team', timestamp: '1 hour ago', read: false },
    { id: '3', message: 'Emily liked your message', timestamp: '3 hours ago', read: true },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

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
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs text-white font-bold"
          >
            {unreadCount}
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
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-accent hover:text-accent/80 transition-colors"
                  >
                    Mark all as read
                  </motion.button>
                )}
              </div>

              <div className="divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      whileHover={{ backgroundColor: 'var(--color-accent)' }}
                      className={`p-4 cursor-pointer transition-colors ${!notification.read ? 'bg-accent/20' : ''}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <p className="text-sm font-medium text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
