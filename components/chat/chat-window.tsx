'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from './message-bubble'
import TypingIndicator from './typing-indicator'

interface Message {
  id: string
  text: string
  sender: 'user' | 'other'
  timestamp: Date
}

interface ChatWindowProps {
  selectedChatId: string | null
}

export default function ChatWindow({ selectedChatId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey! How are you doing?', sender: 'other', timestamp: new Date(Date.now() - 3600000) },
    { id: '2', text: 'Great! Just finished the project', sender: 'user', timestamp: new Date(Date.now() - 3500000) },
    { id: '3', text: 'That sounds amazing! Can you share the details?', sender: 'other', timestamp: new Date(Date.now() - 3400000) },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setInputValue('')

    // Simulate other user typing
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'That sounds great! Looking forward to seeing it.',
          sender: 'other',
          timestamp: new Date(),
        },
      ])
    }, 2000)
  }

  return (
    <div className="flex-1 flex flex-col bg-background ">
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
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
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
          onChange={(e) => setInputValue(e.target.value)}
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
  )
}
