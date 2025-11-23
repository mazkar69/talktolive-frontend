'use client'

import { MessageInterface, UserInterface } from '@/lib/interfaces'
import { motion } from 'framer-motion'
export default function MessageBubble({ message,user }: { message: MessageInterface, user: UserInterface | null }) {

  let isOwn = message.sender._id === user?._id;

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      x: isOwn ? 100 : -100,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`max-w-xs px-4 py-2 rounded-lg cursor-pointer transition-all ${
          isOwn
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-card border border-border text-foreground rounded-bl-none hover:border-muted-foreground'
        }`}
      >
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-muted-foreground'}`}>
          {new Date(message.createdAt.toString()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </motion.div>
    </motion.div>
  )
}
