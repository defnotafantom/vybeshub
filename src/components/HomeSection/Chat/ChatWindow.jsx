// src/components/HomeSection/Chat/ChatWindow.jsx
import React, { useState } from "react";
import MessageInput from "@/components/HomeSection/Chat/MessageInput";

const ChatWindow = ({ user, contact, goBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: contact?.name || "Alice", text: "Ciao! Come va?" },
  ]);

  const handleSend = (text, file) => {
    if (!text && !file) return;
    const newMsg = { id: Date.now(), sender: user?.id || "Me", text, file };
    setMessages(prev => [...prev, newMsg]);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center p-3 border-b bg-gray-50">
        <button onClick={goBack} className="text-blue-500 mr-2">←</button>
        <h3 className="font-semibold">{contact?.name}</h3>
      </div>
      <div className="flex-1 p-2 overflow-y-auto space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className="p-2 rounded-lg bg-gray-100">
            <strong>{msg.sender}</strong>
            <p>{msg.text}</p>
            {msg.file && <p className="text-xs text-gray-500">{msg.file.name}</p>}
          </div>
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;























