'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface User {
  id: string
  name: string
  avatar: string
}

interface Group {
  id: string
  name: string
  type: 'group'
  avatar: string
  lastMessage: string
}

interface CreateGroupModalProps {
  onClose: () => void
  onCreateGroup: (group: Group) => void
}

export default function CreateGroupModal({ onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>([])

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      const newGroup: Group = {
        id: `group_${Date.now()}`,
        name: groupName,
        type: 'group',
        avatar: '👥',
        lastMessage: '',
      }
      onCreateGroup(newGroup)
    }
  }

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md max-h-96 overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold mb-4">Create Group</h2>
          <input
            autoFocus
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name..."
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Add members</p>
          {users.map((user) => (
            <motion.button
              key={user.id}
              onClick={() => toggleMember(user.id)}
              className={`w-full p-3 mb-2 rounded-lg border transition-all flex items-center gap-3 ${
                selectedMembers.includes(user.id)
                  ? 'bg-blue-500/20 border-blue-400'
                  : 'border-border hover:bg-accent/50'
              }`}
            >
              <span className="text-xl">{user.avatar}</span>
              <span className="flex-1 text-left">{user.name}</span>
              {selectedMembers.includes(user.id) && (
                <span className="text-blue-400">✓</span>
              )}
            </motion.button>
          ))}
        </div>

        <div className="p-4 border-t border-border flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-muted hover:bg-accent rounded-lg transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedMembers.length === 0}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Create
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
