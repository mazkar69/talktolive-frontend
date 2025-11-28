import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInterface } from '@/lib/interfaces';
import { MessageInterface } from '@/lib/interfaces';

export type RandomTalkStatus = 'idle' | 'searching' | 'matched' | 'chatting' | 'ended';

interface RandomTalkState {
  status: RandomTalkStatus;
  matchedUser: UserInterface | null;
  messages: MessageInterface[];
  isActive: boolean;
}

const initialState: RandomTalkState = {
  status: 'idle',
  matchedUser: null,
  messages: [],
  isActive: false,
};

const randomTalkSlice = createSlice({
  name: 'randomTalk',
  initialState,
  reducers: {
    // Start searching for random user
    startSearching: (state) => {
      state.status = 'searching';
      state.isActive = true;
      state.matchedUser = null;
      state.messages = [];
    },
    
    // User matched
    setMatched: (state, action: PayloadAction<UserInterface>) => {
      state.status = 'matched';
      state.matchedUser = action.payload;
    },
    
    // Start chatting
    startChatting: (state) => {
      state.status = 'chatting';
    },
    
    // Add message to random chat
    addRandomMessage: (state, action: PayloadAction<MessageInterface>) => {
      state.messages.push(action.payload);
    },
    
    // End chat
    endChat: (state) => {
      state.status = 'ended';
    },
    
    // Reset to idle (exit feature)
    resetRandomTalk: (state) => {
      state.status = 'idle';
      state.matchedUser = null;
      state.messages = [];
      state.isActive = false;
    },
    
    // Cancel search
    cancelSearch: (state) => {
      state.status = 'idle';
      state.isActive = false;
    },
  },
});

export const {
  startSearching,
  setMatched,
  startChatting,
  addRandomMessage,
  endChat,
  resetRandomTalk,
  cancelSearch,
} = randomTalkSlice.actions;

// Selectors
export const selectRandomTalkStatus = (state: { randomTalk: RandomTalkState }) => 
  state.randomTalk.status;

export const selectMatchedUser = (state: { randomTalk: RandomTalkState }) => 
  state.randomTalk.matchedUser;

export const selectRandomMessages = (state: { randomTalk: RandomTalkState }) => 
  state.randomTalk.messages;

export const selectIsRandomTalkActive = (state: { randomTalk: RandomTalkState }) => 
  state.randomTalk.isActive;

export default randomTalkSlice.reducer;
