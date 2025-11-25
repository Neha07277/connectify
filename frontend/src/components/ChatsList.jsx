import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat.user._id}
          onClick={() => setSelectedUser(chat.user)}
          className="
            p-4 mb-2 rounded-xl cursor-pointer backdrop-blur-xl transition-all 
            bg-white/5 border border-white/10 shadow-md 
            hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,255,200,0.5)]
          "
        >
          <div className="flex items-center gap-4">

            <div
              className={`
                relative size-12 
                rounded-full overflow-hidden
                ring-2 
                ${onlineUsers.includes(chat.user._id) ? "ring-green-400" : "ring-slate-600"}
                shadow-[0_0_10px_rgba(0,255,200,0.3)]
              `}
            >
              <img
                src={chat.user.profilePic || "/avatar.png"}
                alt={chat.user.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <h4 className="text-black font-semibold text-base truncate">
              {chat.user.fullName}
            </h4>

          </div>
        </div>
      ))}
    </>
  );
}

export default ChatsList;
