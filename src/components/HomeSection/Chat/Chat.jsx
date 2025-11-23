import React, { useState } from "react";
import { Inbox as InboxIcon, X } from "lucide-react";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";

const Chat = ({ user, uploadFile, contactsData = [], messagesData = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeContact, setActiveContact] = useState(null);

  const toggleInbox = () => {
    setIsOpen(prev => !prev);
    if (isOpen) setActiveContact(null);
  };

  return (
    <>
      <button
        onClick={toggleInbox}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
      >
        {isOpen ? <X size={24}/> : <InboxIcon size={24} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
          {!activeContact ? (
            <ContactList
              contacts={contactsData}
              messages={messagesData}
              onSelectContact={setActiveContact}
            />
          ) : (
            <ChatWindow
              user={user}
              contact={activeContact}
              messages={messagesData[activeContact.id] || []}
              setMessages={newMsgs =>
                messagesData[activeContact.id] = newMsgs
              }
              uploadFile={uploadFile}
              onBack={() => setActiveContact(null)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Chat;












