import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div
      className="flex justify-between items-center 
      bg-gradient-to-r from-[#6466F1] to-[#A755F6]
      border-b border-white/20 max-h-[84px] px-6 flex-1 py-4"
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
            />
          </div>
        </div>

        {/* Username + Status */}
        <div>
          <h3 className="text-white font-medium">{selectedUser.fullName}</h3>
          <p className="text-white/80 text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
      </button>
    </div>
  );
}

export default ChatHeader;
