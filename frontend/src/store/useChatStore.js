import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  /** GET ALL CONTACTS */
  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /** GET CHAT PARTNERS */
  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  /** GET MESSAGES (ID fixed conversion) */
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      const cleaned = res.data.map((m) => ({
        ...m,
        senderId: m.senderId.toString(),
        receiverId: m.receiverId.toString(),
      }));

      set({ messages: cleaned });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  /** SEND MESSAGE (sent ✔ delivered 👁 seen) */
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id.toString(),
      receiverId: selectedUser._id.toString(),
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      status: "sent",
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      const savedMessage = {
        ...res.data,
        senderId: res.data.senderId.toString(),
        receiverId: res.data.receiverId.toString(),
      };

      set({
        messages: get().messages.map((msg) =>
          msg._id === tempId ? savedMessage : msg
        ),
      });
    } catch (error) {
      set({ messages });
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  /** MARK AS DELIVERED (✔) */
  markAsDelivered: async (fromUserId) => {
    try {
      await axiosInstance.put(`/messages/delivered/${fromUserId}`);

      const updated = get().messages.map((msg) =>
        msg.senderId === fromUserId.toString() && msg.status === "sent"
          ? { ...msg, status: "delivered" }
          : msg
      );

      set({ messages: updated });
    } catch (error) {
      console.error("Failed to mark delivered:", error);
    }
  },

  /** MARK AS SEEN (👁) */
  markAsSeen: async (messageId) => {
    try {
      await axiosInstance.put(`/messages/seen/${messageId}`);

      const updated = get().messages.map((msg) =>
        msg._id === messageId ? { ...msg, status: "seen" } : msg
      );

      set({ messages: updated });
    } catch (error) {
      console.error("Failed to mark seen:", error);
    }
  },

  /** SOCKET LISTENERS */
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const cleanedMessage = {
        ...newMessage,
        senderId: newMessage.senderId.toString(),
        receiverId: newMessage.receiverId.toString(),
      };

      const isMessageFromSelectedUser =
        cleanedMessage.senderId === selectedUser._id.toString();
      if (!isMessageFromSelectedUser) return;

      set({ messages: [...get().messages, cleanedMessage] });

      if (isSoundEnabled) {
        const sound = new Audio("/sounds/notification.mp3");
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    });

    socket.on("messagesDelivered", ({ from }) => {
      const updated = get().messages.map((msg) =>
        msg.senderId === from.toString() && msg.status === "sent"
          ? { ...msg, status: "delivered" }
          : msg
      );
      set({ messages: updated });
    });

    socket.on("messageSeen", ({ messageId }) => {
      const updated = get().messages.map((msg) =>
        msg._id === messageId ? { ...msg, status: "seen" } : msg
      );
      set({ messages: updated });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
    socket.off("messagesDelivered");
    socket.off("messageSeen");
  },
}));
