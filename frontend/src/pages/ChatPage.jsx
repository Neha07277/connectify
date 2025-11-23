import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 
      bg-gradient-to-br from-[#E9D8FD] via-[#D6E4FF] to-[#F3E8FF]">

      {/* MAIN WRAPPER */}
      <div className="w-full max-w-6xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl">

        <BorderAnimatedContainer>
          <div className="flex h-full">

            {/* LEFT PANEL */}
            <div className="w-80 
                bg-[#f3f4f6]/80 backdrop-blur-xl 
                border-r border-white/40 
                flex flex-col text-gray-900">

              {/* Profile */}
              <ProfileHeader textColor="text-gray-900" subTextColor="text-gray-700" />

              {/* Tabs */}
              <ActiveTabSwitch 
                textColor="text-gray-900" 
                activeColor="bg-cyan-200 text-gray-900"
              />

             <div className="flex-1 overflow-y-auto p-4 space-y-2">
  {activeTab === "chats" ? (
    <ChatsList textColor="text-black" />
  ) : (
    <ContactList textColor="text-black" />
  )}


              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 
                bg-[#f8fafc]/90 backdrop-blur-xl 
                flex flex-col text-gray-900">

              {selectedUser ? (
                <ChatContainer textColor="text-gray-900" subTextColor="text-gray-700" />
              ) : (
                <NoConversationPlaceholder
                  textColor="text-gray-900"
                  subTextColor="text-gray-700"
                />
              )}

            </div>

          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default ChatPage;
