import React, { useState, useRef } from "react";
import { Paperclip, Send, Image as ImageIcon } from "lucide-react";
import { SparklesIcon } from "lucide-react";
import toast from "react-hot-toast";
import ToneSuggestion from "./ToneSuggestion";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const [loadingTone, setLoadingTone] = useState(false);
  const [toneSuggestions, setToneSuggestions] = useState(null);

  // ⭐ FIXED BACKEND URL + FIXED SUGGESTION HANDLING
  const analyzeTone = async () => {
    if (!text.trim()) {
      toast.error("Type a message first");
      return;
    }

    setLoadingTone(true);

    try {
      const res = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      console.log("Tone Analysis Response:", data);

      // ⭐ FIX: backend returns { suggestion: "..." }
      if (data.suggestion) {
        setToneSuggestions([data.suggestion]); // convert to array for ToneSuggestion UI
      } else {
        toast.error("No suggestions received");
      }
    } catch (error) {
      console.error("Tone API error:", error);
      toast.error("Server error");
    }

    setLoadingTone(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      toast.error("Write a message or upload an image");
      return;
    }

    onSend(text, image);
    setText("");
    setImage(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-4 bg-gray-900 border-t border-gray-700 relative">
      {toneSuggestions && (
        <ToneSuggestion
          suggestions={toneSuggestions}
          onSelect={(msg) => {
            setText(msg);
            setToneSuggestions(null);
          }}
          onClose={() => setToneSuggestions(null)}
        />
      )}

      <form onSubmit={handleSend} className="flex items-center gap-3">
        <button
          type="button"
          onClick={analyzeTone}
          className="bg-white/20 border border-white/30 rounded-lg px-4 py-2
          hover:bg-white/30 transition flex items-center justify-center"
        >
          {loadingTone ? "..." : <SparklesIcon className="w-5 h-5 text-white" />}
        </button>

        <textarea
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow bg-gray-800 border border-gray-600 rounded-xl p-3 text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[45px]"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="p-3 bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700"
        >
          <ImageIcon className="w-5 h-5 text-white" />
        </button>

        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="submit"
          className="p-3 bg-blue-600 rounded-xl hover:bg-blue-700 text-white flex items-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      {image && (
        <div className="mt-3 bg-gray-800 p-3 rounded-xl border border-gray-700">
          <img src={image} alt="preview" className="max-h-32 rounded-lg" />
        </div>
      )}
    </div>
  );
}
