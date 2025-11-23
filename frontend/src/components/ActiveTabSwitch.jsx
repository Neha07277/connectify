import { useChatStore } from "../store/useChatStore";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div className="flex justify-center gap-4 p-2 m-2 w-full">

      {/* Chats Button – shifted left */}
      <button
        onClick={() => setActiveTab("chats")}
        className={`px-5 py-2 rounded-lg font-bold transition-all -ml-3 ${
          activeTab === "chats"
            ? "bg-white text-black shadow"
            : "bg-white/70 text-black hover:bg-white"
        }`}
      >
        Chats
      </button>

      {/* Contacts Button */}
      <button
        onClick={() => setActiveTab("contacts")}
        className={`px-5 py-2 rounded-lg font-bold transition-all ${
          activeTab === "contacts"
            ? "bg-white text-black shadow"
            : "bg-white/70 text-black hover:bg-white"
        }`}
      >
        Contacts
      </button>

    </div>
  );
}

export default ActiveTabSwitch;
