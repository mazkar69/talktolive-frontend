'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import LoginForm from './login-form'
import RegisterForm from './register-form'

interface AuthPageProps {
  onAuthenticate: () => void
}

export default function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-3xl font-bold text-white mb-2">TalkToLive</h1>
            <p className="text-slate-400 text-sm">Connect instantly with anyone, anywhere</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-700/50 px-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 font-medium transition-all duration-200 ${
                isLogin
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 font-medium transition-all duration-200 ${
                !isLogin
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          <div className="px-8 py-8">
            {isLogin ? (
              <LoginForm onSuccess={onAuthenticate} />
            ) : (
              <RegisterForm onSuccess={onAuthenticate} />
            )}
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6 py-2">
          Secure • Fast • Private
        </p>
      </motion.div>
    </div>
  )
}
