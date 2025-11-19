"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthPage from "@/components/auth/auth-page";
import ChatApp from "@/components/chat/chat-app";
import api from "@/lib/apiRequest";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Here you can check for existing authentication, e.g., check localStorage or make an API call
    const token = localStorage.getItem("chatToken");
    if (token) {
      api
        .post("/api/user/verifyToken", { token })
        .then((response) => {
          // console.log("Token verification response:", response.data);
          if (response.data._id) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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
  );
}
