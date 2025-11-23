// src/components/HomeSection/Chat/ChatInput.jsx
import React, { useState } from "react";
import { Paperclip } from "lucide-react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]); // array di file

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({
        file: f,
        url: URL.createObjectURL(f)
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSend = () => {
    if (!text.trim() && files.length === 0) return;
    onSend({ text, files });
    setText("");
    setFiles([]);
  };

  return (
    <div className="p-2 border-t border-gray-300 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button onClick={() => document.getElementById("fileInput")?.click()}
          className="flex-shrink-0 bg-gray-200 p-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center">
          <Paperclip />
        </button>
        <input
          id="fileInput"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="text"
          placeholder="Scrivi un messaggio..."
          value={text}
          onChange={e => setText(e.target.value)}
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

      {/* Preview dei file */}
      {files.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {files.map((f, i) => (
            <div key={i} className="relative">
              {f.file.type.startsWith("image/")
                ? <img src={f.url} alt="preview" className="w-24 h-24 object-contain rounded-xl border border-gray-200 shadow-sm"/>
                : <video src={f.url} controls className="w-24 h-24 object-contain rounded-xl border border-gray-200 shadow-sm"/>
              }
              <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
