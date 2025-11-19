'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthPage from '@/components/auth/auth-page'
import ChatApp from '@/components/chat/chat-app'

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <main className="w-full h-screen bg-background">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthPage onAuthenticate={() => setIsAuthenticated(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-screen"
          >
            <ChatApp />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
