import React from "react";
import { X } from "lucide-react";

export default function ToneSuggestion({ suggestions, onSelect, onClose }) {
  return (
    <div className="absolute bottom-20 left-0 right-0 p-4">
      <div className="bg-gray-800 text-white p-4 rounded-xl shadow-xl border border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            💡 Suggested Tones
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {suggestions.map((s, index) => (
          <button
            key={index}
            className="block w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-lg my-1"
            onClick={() => onSelect(s)}   // ✔ replaced onApply with onSelect
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
