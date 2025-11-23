// src/store/chatStore.js
import create from "zustand";

const STORAGE_KEY = "chat_store_v1";

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persisted = loadFromStorage() || { contacts: [], messages: {}, user: null };

export const useChatStore = create((set, get) => ({
  user: persisted.user || null,
  contacts: persisted.contacts || [],
  messages: persisted.messages || {},

  // setters
  setUser: (u) => set({ user: u }),
  setContacts: (contacts) => set({ contacts }),
  setMessages: (messages) => set({ messages }),

  // add message to a conversation (contactId)
  addMessage: (contactId, message) => {
    set((state) => {
      const conv = state.messages[contactId] ? [...state.messages[contactId]] : [];
      conv.push(message);
      const newMessages = { ...state.messages, [contactId]: conv };
      return { messages: newMessages };
    });
  },

  // replace conversation
  replaceConversation: (contactId, newConv) => {
    set((state) => ({ messages: { ...state.messages, [contactId]: newConv } }));
  },

  // mark messages read
  markRead: (contactId) => {
    set((state) => {
      const conv = (state.messages[contactId] || []).map(m => ({ ...m, read: true }));
      return { messages: { ...state.messages, [contactId]: conv } };
    });
  },

  // helpers
  getUnreadCount: () => {
    const state = get();
    return Object.values(state.messages).reduce((acc, conv) =>
      acc + conv.filter(m => !m.read && m.sender_id !== state.user?.id).length, 0);
  }
}));

// persist to localStorage on changes
useChatStore.subscribe((state) => {
  try {
    const payload = {
      user: state.user,
      contacts: state.contacts,
      messages: state.messages
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }
});
