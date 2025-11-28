'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectRandomTalkStatus,
  selectMatchedUser,
  startSearching,
  cancelSearch,
  resetRandomTalk,
  startChatting,
  setMatched,
} from '@/store/slices/randomTalkSlice'
import { selectUser } from '@/store/slices/userSlice'
import { useSocket } from '@/app/socketProvider'
import RandomChatWindow from './random-chat-window'

interface RandomTalkModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RandomTalkModal({ isOpen, onClose }: RandomTalkModalProps) {
  const dispatch = useAppDispatch()
  const { emit, socket } = useSocket()
  const status = useAppSelector(selectRandomTalkStatus)
  const matchedUser = useAppSelector(selectMatchedUser)
  const user = useAppSelector(selectUser)

  useEffect(() => {
    if (!socket) return

    // Listen for match found
    socket.on('randomTalkMatched', (data: { user: any }) => {
      dispatch(setMatched(data.user))
      setTimeout(() => {
        dispatch(startChatting())
      }, 2000) // Show "Matched!" animation for 2 seconds
    })

    return () => {
      socket.off('randomTalkMatched')
    }
  }, [socket, dispatch])

  const handleStartSearch = () => {
    dispatch(startSearching())
    // Emit to server to find random user (API placeholder)
    emit('findRandomTalk', { userId: user?._id })
  }

  const handleCancelSearch = () => {
    dispatch(cancelSearch())
    emit('cancelRandomTalk', { userId: user?._id })
  }

  const handleTryAgain = () => {
    dispatch(startSearching())
    emit('findRandomTalk', { userId: user?._id })
  }

  const handleExit = () => {
    dispatch(resetRandomTalk())
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget && status !== 'chatting') {
            handleExit()
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`bg-card border border-border rounded-2xl shadow-2xl overflow-hidden ${
            status === 'chatting' ? 'w-full h-full md:w-[90vw] md:h-[90vh]' : 'w-full max-w-md'
          }`}
        >
          {/* Chatting State - Full Window */}
          {status === 'chatting' && <RandomChatWindow />}

          {/* Other States */}
          {status !== 'chatting' && (
            <div className="p-8">
              {/* Close Button */}
              {status !== 'searching' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleExit}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors"
                >
                  ✕
                </motion.button>
              )}

              {/* Idle State */}
              {status === 'idle' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl">
                    🎲
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Random Talk</h2>
                    <p className="text-muted-foreground text-sm">
                      Connect with random people for casual conversations
                    </p>
                  </div>
                  
                  <div className="space-y-3 text-left bg-accent/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <p className="text-sm">Anonymous and fun conversations</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <p className="text-sm">Chats are not saved</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <p className="text-sm">End anytime and find new people</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">⚠</span>
                      <p className="text-sm">Be respectful and kind</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartSearch}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                  >
                    Start Random Talk
                  </motion.button>
                </motion.div>
              )}

              {/* Searching State */}
              {status === 'searching' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl"
                  >
                    🔍
                  </motion.div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Searching...</h2>
                    <p className="text-muted-foreground text-sm">
                      Looking for someone to chat with
                    </p>
                  </div>

                  <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className="w-3 h-3 rounded-full bg-purple-500"
                      />
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelSearch}
                    className="px-6 py-2 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive/20 transition-colors border border-destructive/30"
                  >
                    Cancel Search
                  </motion.button>
                </motion.div>
              )}

              {/* Matched State */}
              {status === 'matched' && matchedUser && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                    className="text-6xl"
                  >
                    🎉
                  </motion.div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-green-500">Matched!</h2>
                    <p className="text-muted-foreground text-sm">
                      You're connected with {matchedUser.name}
                    </p>
                  </div>

                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                    {matchedUser.name.charAt(0).toUpperCase()}
                  </div>

                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-sm text-muted-foreground"
                  >
                    Starting chat...
                  </motion.div>
                </motion.div>
              )}

              {/* Ended State */}
              {status === 'ended' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-6"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-accent flex items-center justify-center text-5xl">
                    👋
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Chat Ended</h2>
                    <p className="text-muted-foreground text-sm">
                      Thanks for chatting! Want to talk to someone else?
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleTryAgain}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      Find New Person
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExit}
                      className="flex-1 px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg font-semibold transition-colors"
                    >
                      Exit
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
