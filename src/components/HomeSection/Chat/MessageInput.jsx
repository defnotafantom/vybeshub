// src/components/HomeSection/Chat/MessageInput.jsx
import React, { useState } from "react";
import { Paperclip } from "lucide-react";

const MessageInput = ({ onSend }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  const handleSend = () => {
    if (!content && !file) return;
    onSend(content, file);
    setContent("");
    setFile(null);
  };

  return (
    <div className="p-2 border-t border-gray-300 flex flex-wrap items-center gap-2">
      <button
        onClick={() => document.getElementById("fileInput")?.click()}
        className="flex-shrink-0 bg-gray-200 p-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center"
      >
        <Paperclip />
      </button>
      <input
        id="fileInput"
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={e => e.target.files && setFile(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Scrivi un messaggio..."
        value={content}
        onChange={e => setContent(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        className="flex-1 min-w-[100px] p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        onClick={handleSend}
        className="flex-shrink-0 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors"
      >
        Invia
      </button>
    </div>
  );
};

export default MessageInput;

















