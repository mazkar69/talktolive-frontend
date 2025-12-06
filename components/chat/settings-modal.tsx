'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppDispatch } from '@/store/hooks'
import { clearUser } from '@/store/slices/userSlice'
import { UserInterface } from '@/lib/interfaces'


interface SettingsModalProps {
  userProfile: UserInterface
  // setUserProfile: (profile: UserInterface) => void
  onClose: () => void
}

export default function SettingsModal({ userProfile, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState(userProfile)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // setUserProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    // Clear user from Redux store
    dispatch(clearUser())
    // Clear token from localStorage
    localStorage.removeItem('chatToken')
    onClose()
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-border sticky top-0 bg-card flex items-center justify-between">
            <h2 className="text-xl font-bold">Settings</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-2xl leading-none hover:text-accent transition-colors"
            >
              ×
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Profile Section */}
            <div>
              <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Personal Details</h3>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="Your name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>


          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border sticky bottom-0 bg-card">
            <div className="flex gap-3 justify-end mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border hover:bg-accent/20 transition-colors font-medium text-sm"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors font-medium text-sm"
              >
                {saved ? '✓ Saved' : 'Save Changes'}
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full px-4 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors font-medium text-sm"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
