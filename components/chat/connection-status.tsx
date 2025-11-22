'use client';

// This commponent does not manage socket connection directly, it only shows connection status and allows toggling active state. when the user toggles active state, the socket connection is managed in chat-app.tsx component, inside useEffect hook.

import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsConnected, selectIsActive, setActive } from '@/store/slices/socketSlice';

export default function ConnectionStatus() {
  const dispatch = useAppDispatch();
  const isConnected = useAppSelector(selectIsConnected);
  const isActive = useAppSelector(selectIsActive);

  const handleToggleActive = () => {
    dispatch(setActive(!isActive));
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Indicator */}
      <div className="flex items-center gap-2">
        <motion.div
          className={`w-2.5 h-2.5 rounded-full ${
            isConnected && isActive ? 'bg-green-500' : 'bg-gray-400'
          }`}
          animate={{
            scale: isConnected && isActive ? [1, 1.2, 1] : 1,
            opacity: isConnected && isActive ? [1, 0.8, 1] : 0.5,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <span className="text-xs font-medium hidden md:inline">
          {isConnected && isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggleActive}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isActive
            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/30'
            : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border border-gray-500/30'
        }`}
        title={isActive ? 'Make yourself inactive' : 'Make yourself active'}
      >
        {isActive ? 'Go Inactive' : 'Go Active'}
      </motion.button>

      {/* Disconnected Alert */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed top-20 right-4 z-50 bg-card border border-border rounded-lg shadow-xl p-4 max-w-sm"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center shrink-0">
                <span className="text-lg">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm mb-1">You're Inactive</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  You won't receive real-time messages and notifications while inactive.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleActive}
                  className="w-full px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                >
                  Connect Now
                </motion.button>
              </div>
              <button
                onClick={() => {/* Close alert */}}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
