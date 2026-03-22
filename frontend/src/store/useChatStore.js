import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isTyping: false,
  replyingTo: null,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, replyingTo } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        ...messageData,
        replyTo: replyingTo?._id || null,
      });
      set({ messages: [...messages, res.data], replyingTo: null });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  reactToMessage: async (messageId, emoji) => {
    try {
      await axiosInstance.put(`/messages/react/${messageId}`, { emoji });
    } catch (error) {
      toast.error("Failed to react");
    }
  },

  markAsSeen: async (senderId) => {
    try {
      await axiosInstance.put(`/messages/seen/${senderId}`);
    } catch (error) {
      console.error("markAsSeen error:", error);
    }
  },

  deleteMessage: async (messageId, deleteFor) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`, {
        data: { deleteFor },
      });
      set({
        messages: get().messages.map((m) =>
          m._id === messageId
            ? deleteFor === "everyone"
              ? { ...m, deletedForEveryone: true, text: null, image: null }
              : { ...m, _hiddenForMe: true }
            : m
        ).filter((m) => !m._hiddenForMe),
      });
    } catch (error) {
      toast.error("Failed to delete message");
    }
  },

  setReplyingTo: (message) => set({ replyingTo: message }),
  clearReplyingTo: () => set({ replyingTo: null }),

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    const myId = useAuthStore.getState().authUser._id;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      set({ messages: [...get().messages, newMessage] });
      get().markAsSeen(selectedUser._id);
    });

    socket.on("messageReaction", ({ messageId, reactions }) => {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId ? { ...m, reactions } : m
        ),
      });
    });

    socket.on("messagesSeen", ({ by }) => {
      set({
        messages: get().messages.map((m) =>
          m.senderId === myId && !m.seenBy?.includes(by)
            ? { ...m, seenBy: [...(m.seenBy || []), by] }
            : m
        ),
      });
    });

    socket.on("messageDeleted", ({ messageId, deletedForEveryone }) => {
      set({
        messages: get().messages.map((m) =>
          m._id === messageId
            ? deletedForEveryone
              ? { ...m, deletedForEveryone: true, text: null, image: null }
              : m
            : m
        ),
      });
    });

    socket.on("userTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) set({ isTyping: true });
    });
    socket.on("userStopTyping", ({ senderId }) => {
      if (senderId === selectedUser._id) set({ isTyping: false });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messageReaction");
    socket.off("messagesSeen");
    socket.off("messageDeleted");
    socket.off("userTyping");
    socket.off("userStopTyping");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser, replyingTo: null, isTyping: false }),
}));