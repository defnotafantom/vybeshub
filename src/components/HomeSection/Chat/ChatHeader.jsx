// src/components/HomeSection/Chat/ChatHeader.jsx
import React from "react";

const ChatHeader = ({ contact, onBack, onClose }) => {
  return (
    <div className="bg-blue-500 text-white p-3 font-bold flex justify-between items-center rounded-t-3xl">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="mr-2">←</button>
        <img src={contact.avatar_url} alt={contact.username} className="w-10 h-10 rounded-full"/>
        <span>{contact.username}</span>
        <span className={`w-2 h-2 rounded-full ${contact.online ? "bg-green-500" : "bg-gray-400"}`}></span>
      </div>
      <button onClick={onClose}>×</button>
    </div>
  );
};

export default ChatHeader;
