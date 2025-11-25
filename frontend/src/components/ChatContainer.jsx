import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    sendMessage,

    // ⭐ You MUST have these in useChatStore.js
    markAsDelivered,
    markAsSeen,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessagesByUserId(selectedUser._id);

    // ⭐ MARK ALL UNSEEN MESSAGES AS DELIVERED
    markAsDelivered(selectedUser._id);

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  // ⭐ MARK RECEIVED MESSAGES AS SEEN
  useEffect(() => {
    messages.forEach((msg) => {
      if (
        msg.receiverId === authUser._id &&
        msg.status === "delivered"
      ) {
        markAsSeen(msg._id);
      }
    });
  }, [messages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (text, image) => {
    sendMessage({ text, image });
  };

  const renderStatus = (msg) => {
    if (msg.senderId !== authUser._id) return null;

    if (msg.status === "sent")
      return <span className="text-gray-300 text-xs">⏱️</span>;

    if (msg.status === "delivered")
      return <span className="text-green-300 text-xs">✔️</span>;

    if (msg.status === "seen")
      return <span className="text-blue-300 text-xs">👁️</span>;

    return null;
  };

  return (
    <>
      <ChatHeader />

      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${
                  msg.senderId === authUser._id ? "chat-end" : "chat-start"
                }`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}

                  {msg.text && <p className="mt-2">{msg.text}</p>}

                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {renderStatus(msg)}
                  </p>
                </div>
              </div>
            ))}

            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : selectedUser ? (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        ) : null}
      </div>

      <MessageInput onSend={handleSend} />
    </>
  );
}

export default ChatContainer;
