'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface User {
  id: string
  name: string
  avatar: string
}

interface SearchUsersProps {
  onClose: () => void
  onStartChat: (user: User) => void
}

export default function SearchUsers({ onClose, onStartChat }: SearchUsersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [users] = useState<User[]>([
    { id: 'new1', name: 'Alex Thompson', avatar: '👨‍🔬' },
    { id: 'new2', name: 'Jessica Lee', avatar: '👩‍💼' },
    { id: 'new3', name: 'David Park', avatar: '👨‍🎯' },
    { id: 'new4', name: 'Lisa Anderson', avatar: '👩‍⚖️' },
  ])

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
  }

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 20 },
    },
  }

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        variants={contentVariants}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md max-h-96 overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-border">
          <motion.input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
            whileFocus={{ scale: 1.01 }}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {filteredUsers.map((user, index) => (
                <motion.button
                  key={user.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  onClick={() => onStartChat(user)}
                  className="w-full p-4 border-b border-border text-left hover:bg-accent/50 transition-colors flex items-center gap-3"
                >
                  <motion.span
                    className="text-2xl"
                    whileHover={{ scale: 1.1 }}
                  >
                    {user.avatar}
                  </motion.span>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.name.replace(/\s/g, '').toLowerCase()}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center text-muted-foreground"
            >
              No users found
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
