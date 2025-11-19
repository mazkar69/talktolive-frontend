'use client'

import { motion } from 'framer-motion'

export default function TypingIndicator() {
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  const dotVariants = {
    hidden: { opacity: 0.3, y: 0 },
    visible: (i: number) => ({
      opacity: 1,
      y: [-6, 0, -6],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        delay: i * 0.15,
      },
    }),
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-2"
    >
      <div className="px-4 py-2 bg-card border border-border rounded-lg">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-muted-foreground rounded-full"
              variants={dotVariants}
              custom={i}
              initial="hidden"
              animate="visible"
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Someone is typing...</p>
    </motion.div>
  )
}
