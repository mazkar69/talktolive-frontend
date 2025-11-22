import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SocketState {
  isConnected: boolean;
  isActive: boolean;
  connectionError: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  isActive: true, // User preference to be active
  connectionError: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    // Set socket connection status
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
      if (action.payload) {
        state.connectionError = null;
      }
    },
    
    // Set user active preference
    setActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userActive', action.payload.toString());
      }
    },
    
    // Set connection error
    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
    },
    
    // Reset socket state
    resetSocket: (state) => {
      state.isConnected = false;
      state.isActive = true;
      state.connectionError = null;
    },
  },
});

export const {
  setConnected,
  setActive,
  setConnectionError,
  resetSocket,
} = socketSlice.actions;

// Selectors
export const selectIsConnected = (state: { socket: SocketState }) => state.socket.isConnected;
export const selectIsActive = (state: { socket: SocketState }) => state.socket.isActive;
export const selectConnectionError = (state: { socket: SocketState }) => state.socket.connectionError;
export const selectSocketStatus = (state: { socket: SocketState }) => ({
  isConnected: state.socket.isConnected,
  isActive: state.socket.isActive,
  connectionError: state.socket.connectionError,
});

export default socketSlice.reducer;
