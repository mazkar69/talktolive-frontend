import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatsReducer from './slices/chatsSlice';
import socketReducer from './slices/socketSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer,
    socket: socketReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
