'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface UserProfile {
  name: string
  email: string
  avatar: string
  hideFromSearch: boolean
}

interface SettingsModalProps {
  userProfile: UserProfile
  setUserProfile: (profile: UserProfile) => void
  onClose: () => void
}

export default function SettingsModal({ userProfile, setUserProfile, onClose }: SettingsModalProps) {
  const [formData, setFormData] = useState(userProfile)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setUserProfile(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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

            {/* Privacy Section */}
            <div>
              <h3 className="font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Privacy Settings</h3>
              
              <div className="space-y-3">
                {/* Hide from search toggle */}
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-accent transition-colors">
                  <div>
                    <p className="text-sm font-medium">Hide from search</p>
                    <p className="text-xs text-muted-foreground">Users won't be able to find your username</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({ ...formData, hideFromSearch: !formData.hideFromSearch })}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      formData.hideFromSearch ? 'bg-accent' : 'bg-muted'
                    }`}
                  >
                    <motion.div
                      animate={{ x: formData.hideFromSearch ? 22 : 2 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                    />
                  </motion.button>
                </div>

                {/* Online status */}
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-accent transition-colors">
                  <div>
                    <p className="text-sm font-medium">Show online status</p>
                    <p className="text-xs text-muted-foreground">Let others see when you're active</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-12 h-7 rounded-full bg-accent"
                  >
                    <motion.div
                      animate={{ x: 22 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                    />
                  </motion.button>
                </div>

                {/* Message read receipts */}
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:border-accent transition-colors">
                  <div>
                    <p className="text-sm font-medium">Message read receipts</p>
                    <p className="text-xs text-muted-foreground">Show when you've read a message</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative w-12 h-7 rounded-full bg-accent"
                  >
                    <motion.div
                      animate={{ x: 22 }}
                      className="absolute top-1 w-5 h-5 bg-white rounded-full shadow"
                    />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border sticky bottom-0 bg-card flex gap-3 justify-end">
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
        </div>
      </motion.div>
    </>
  )
}
