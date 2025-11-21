import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChatInterface } from "./interfaces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getChatName(chat: ChatInterface) {
  const user = localStorage.getItem("userInfo");
  const currentUserId = user ? JSON.parse(user)._id : null;

  if (chat.isGroupChat) {
    return chat.chatName;
  } else {
    // Assuming chat.users is an array of user objects with a 'name' property
    const otherUser = chat.users.find((user) => user._id !== currentUserId);
    const name = otherUser ? otherUser.name : "Unknown User";
    return name;
  }
}

export function getChatImage(chat: ChatInterface) {
  const user = localStorage.getItem("userInfo");
  const currentUserId = user ? JSON.parse(user)._id : null;

  if (chat.isGroupChat) {
    return "https://icon-library.com/images/group-chat-icon/group-chat-icon-10.jpg";
  } else {
    // Assuming chat.users is an array of user objects with a 'pic' property
    const otherUser = chat.users.find((user) => user._id !== currentUserId);
    const pic = otherUser
      ? otherUser.pic
      : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    return pic;
  }
}
