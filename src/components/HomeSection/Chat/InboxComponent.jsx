// src/components/HomeSection/Chat/InboxComponent.jsx
import React, { useState } from "react";
import ContactList from "@/components/HomeSection/Chat/ContactList";
import ChatWindow from "@/components/HomeSection/Chat/ChatWindow";

const InboxComponent = ({ user }) => {
  const [contacts] = useState([
    { id: "alice", name: "Alice" },
    { id: "bob", name: "Bob" },
    { id: "carla", name: "Carla" },
  ]);

  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-full w-full rounded-2xl overflow-hidden bg-white shadow-xl">
      {!activeChat ? (
        <ContactList contacts={contacts} onSelect={setActiveChat} />
      ) : (
        <ChatWindow user={user} contact={activeChat} goBack={() => setActiveChat(null)} />
      )}
    </div>
  );
};

export default InboxComponent;

