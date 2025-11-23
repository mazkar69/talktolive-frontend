import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationInterface } from '@/lib/interfaces';



interface NotificationState {
  notifications: NotificationInterface[];
  totalCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  totalCount: 0,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Set all notifications
    setNotifications: (state, action: PayloadAction<NotificationInterface[]>) => {
      state.notifications = action.payload;
      state.totalCount = action.payload.reduce((sum, item) => sum + item.count, 0);
    },
    
    // Add a single notification
    addNotification: (state, action: PayloadAction<NotificationInterface>) => {
      const existingIndex = state.notifications.findIndex(
        notif => notif.chat._id === action.payload.chat._id
      );
      
      if (existingIndex !== -1) {
        state.notifications[existingIndex] = action.payload;
      } else {
        state.notifications.unshift(action.payload);
      }
      
      state.totalCount = state.notifications.reduce((sum, item) => sum + item.count, 0);
    },
    
    // Remove notification for a specific chat
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notif => notif.chat._id !== action.payload
      );
      state.totalCount = state.notifications.reduce((sum, item) => sum + item.count, 0);
    },
    
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
      state.totalCount = 0;
    },
    
    // Update notification count for a chat
    updateNotificationCount: (state, action: PayloadAction<{ chatId: string; count: number }>) => {
      const index = state.notifications.findIndex(
        notif => notif.chat._id === action.payload.chatId
      );
      
      if (index !== -1) {
        state.notifications[index].count = action.payload.count;
        state.totalCount = state.notifications.reduce((sum, item) => sum + item.count, 0);
      }
    },
  },
});

export const {
  setNotifications,
  addNotification,
  removeNotification,
  clearNotifications,
  updateNotificationCount,
} = notificationSlice.actions;

// Selectors
export const selectAllNotifications = (state: { notification: NotificationState }) => 
  state.notification.notifications;

export const selectTotalNotificationCount = (state: { notification: NotificationState }) => 
  state.notification.totalCount;

export const selectNotificationByChat = (chatId: string) => (state: { notification: NotificationState }) =>
  state.notification.notifications.find(notif => notif.chat._id === chatId) || null;

export default notificationSlice.reducer;
