"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthPage from "@/components/auth/auth-page";
import { useAppSelector } from "@/store/hooks";
import { selectIsAuthenticated } from "@/store/slices/userSlice";

export default function AuthPageRoute() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    // If user is authenticated, redirect to home/chat
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Don't render auth page if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AuthPage />
    </motion.div>
  );
}
