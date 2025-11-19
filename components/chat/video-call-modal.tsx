'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface VideoCallModalProps {
  onClose: () => void
}

export default function VideoCallModal({ onClose }: VideoCallModalProps) {
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isRinging, setIsRinging] = useState(true)

  const handleAnswerCall = () => {
    setIsRinging(false)
  }

  const handleRejectCall = () => {
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-card border border-border rounded-2xl overflow-hidden shadow-2xl"
      >
        {isRinging ? (
          // Ringing State
          <div className="h-96 flex flex-col items-center justify-center gap-8 p-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-4xl"
            >
              👩
            </motion.div>
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Incoming Call</h2>
              <p className="text-muted-foreground">Sarah Wilson is calling...</p>
            </div>

            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="flex gap-2"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full"
                  animate={{ opacity: [0.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnswerCall}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-colors"
              >
                Answer
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRejectCall}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold transition-colors"
              >
                Decline
              </motion.button>
            </div>
          </div>
        ) : (
          // In-Call State
          <div className="h-96 bg-gradient-to-br from-slate-900 to-slate-800 relative">
            {/* Main Video Feed */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-64 h-64 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-6xl">
                👩
              </div>
            </div>

            {/* Local Video Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-6 right-6 w-32 h-32 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-3xl border-2 border-white"
            >
              👨
            </motion.div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-4 rounded-full transition-all ${
                  isMicOn
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                title={isMicOn ? 'Mute' : 'Unmute'}
              >
                {isMicOn ? '🎤' : '🔇'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCameraOn(!isCameraOn)}
                className={`p-4 rounded-full transition-all ${
                  isCameraOn
                    ? 'bg-slate-700 hover:bg-slate-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
                title={isCameraOn ? 'Camera on' : 'Camera off'}
              >
                {isCameraOn ? '📹' : '🚫'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all"
                title="End call"
              >
                ☎️
              </motion.button>
            </div>

            {/* Call Duration */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium"
            >
              Call Duration: 02:34
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
