'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ChatSidebar from './chat-sidebar'
import ChatWindow from './chat-window'
import ThemeToggle from '@/components/theme-toggle'
import VideoCallModal from './video-call-modal'
import NotificationsDropdown from './notifications-dropdown'
import SettingsModal from './settings-modal'
import { ChatInterface } from '@/lib/interfaces'

export default function ChatApp() {
  const [selectedChat, setSelectedChat] = useState<string | null>('user1')
  const [chats, setChats] = useState<ChatInterface[]>([
    { _id: 'user1', chatName: 'Alice', isGroupChat: false, users: [],  latestMessage: 'Hey there!',  },
    { _id: 'user2', chatName: 'Bob', isGroupChat: false, users: [],  latestMessage: 'What\'s up?' },
    { _id: 'group1', chatName: 'Study Group', isGroupChat: true, users: [], latestMessage: 'Don\'t forget the meeting.' },
  ])

  const [showVideoCall, setShowVideoCall] = useState(false)
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '👤',
    hideFromSearch: false,
  })

  const handleSelectChat = (id: string) => {
    setSelectedChat(id)
    setShowMobileChat(true)
  }

  const handleBackToList = () => {
    setShowMobileChat(false)
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="hidden md:flex md:flex-col">
        <ChatSidebar 
          chats={chats} 
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onAddChat={(chat) => setChats([...chats, chat])}
        />
      </div>

      <div className={`md:hidden w-full ${showMobileChat ? 'hidden' : 'flex flex-col'}`}>
        <ChatSidebar 
          chats={chats} 
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          onAddChat={(chat) => setChats([...chats, chat])}
        />
      </div>

      <div className={`flex-1 flex flex-col ${!showMobileChat && 'hidden md:flex'}`}>
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
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">TalkToLive</span>
            </div>
            {/* <span className="text-2xl">{chats.find(c => c._id === selectedChat)?.avatar}</span> */}
            <div className="min-w-0">
              <h2 className="font-semibold text-sm md:text-base truncate">{chats.find(c => c._id === selectedChat)?.chatName}</h2>
              <p className="text-xs text-muted-foreground">Active now</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
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

        <ChatWindow selectedChatId={selectedChat} />
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
  )
}
