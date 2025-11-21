import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatInterface } from '@/lib/interfaces';

interface ChatsState {
  chats: ChatInterface[];
  selectedChatId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatsState = {
  chats: [],
  selectedChatId: null,
  isLoading: false,
  error: null,
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    // Set all chats
    setChats: (state, action: PayloadAction<ChatInterface[]>) => {
      state.chats = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Add a single chat
    addChat: (state, action: PayloadAction<ChatInterface>) => {
      const existingIndex = state.chats.findIndex(chat => chat._id === action.payload._id);
      if (existingIndex === -1) {
        state.chats.unshift(action.payload);
      }
    },
    
    // Update a chat
    updateChat: (state, action: PayloadAction<ChatInterface>) => {
      const index = state.chats.findIndex(chat => chat._id === action.payload._id);
      if (index !== -1) {
        state.chats[index] = action.payload;
      }
    },
    
    // Delete a chat
    deleteChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(chat => chat._id !== action.payload);
      if (state.selectedChatId === action.payload) {
        state.selectedChatId = null;
      }
    },
    
    // Update latest message for a chat
    updateLatestMessage: (state, action: PayloadAction<{ chatId: string; message: string }>) => {
      const index = state.chats.findIndex(chat => chat._id === action.payload.chatId);
      if (index !== -1) {
        state.chats[index].latestMessage = action.payload.message;
        // Move chat to top of list
        const chat = state.chats.splice(index, 1)[0];
        state.chats.unshift(chat);
      }
    },
    
    // Select a chat
    selectChat: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
    
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    // Set error
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear all chats
    clearChats: (state) => {
      state.chats = [];
      state.selectedChatId = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setChats,
  addChat,
  updateChat,
  deleteChat,
  updateLatestMessage,
  selectChat,
  setLoading,
  setError,
  clearChats,
} = chatsSlice.actions;

// Selectors
export const selectAllChats = (state: { chats: ChatsState }) => state.chats.chats;
export const selectSelectedChatId = (state: { chats: ChatsState }) => state.chats.selectedChatId;
export const selectSelectedChat = (state: { chats: ChatsState }) => 
  state.chats.chats.find(chat => chat._id === state.chats.selectedChatId) || null;
export const selectChatsLoading = (state: { chats: ChatsState }) => state.chats.isLoading;
export const selectChatsError = (state: { chats: ChatsState }) => state.chats.error;
export const selectChatById = (chatId: string) => (state: { chats: ChatsState }) =>
  state.chats.chats.find(chat => chat._id === chatId) || null;

export default chatsSlice.reducer;
