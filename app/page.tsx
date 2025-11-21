"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ChatApp from "@/components/chat/chat-app";
import api from "@/lib/apiRequest";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser, selectIsAuthenticated, selectUser, setUser } from "@/store/slices/userSlice";

export default function Home() {
  const router = useRouter();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  console.log("Current user from Redux store:", user);
  console.log("Is Authenticated:", isAuthenticated);


  useEffect(() => {
    // If user is authenticated, stay on chat page
    if (isAuthenticated) {
      return;
    }

    // If no user in Redux, check localStorage for token
    const token = localStorage.getItem("chatToken");
    if (token) {
      // Verify token with backend
      api
        .post("/api/user/verifyToken", { token })
        .then((response) => {
          if (response.data._id) {
            dispatch(setUser(response.data));
          } else {
            dispatch(clearUser());
            localStorage.removeItem("chatToken");
            router.push("/auth");
          }
        })
        .catch(() => {
          dispatch(clearUser());
          localStorage.removeItem("chatToken");
          router.push("/auth");
        });
    } else {
      // No token found, redirect to auth page
      router.push("/auth");
    }
  }, [isAuthenticated, dispatch, router]);

  // Show nothing while checking authentication
  if (!isAuthenticated) {
    return null;
  }


   
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen"
    >
      <ChatApp />
    </motion.div>
  );
}
