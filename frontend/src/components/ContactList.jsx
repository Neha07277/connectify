import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="
            bg-white/80 
            p-4 
            rounded-xl 
            cursor-pointer 
            hover:bg-white 
            shadow-sm 
            border border-gray-200
            transition-all
          "
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            
            {/* Avatar */}
            <div
              className={`avatar ${
                onlineUsers.includes(contact._id) ? "online" : "offline"
              }`}
            >
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt="profile"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Name Text — DARK & VISIBLE */}
            <h4 className="text-gray-900 font-medium">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}

export default ContactList;
