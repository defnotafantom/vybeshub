// src/components/HomeSection/Chat/ContactList.jsx
import React from "react";

const ContactList = ({ contacts, onSelect }) => {
  if (!contacts || contacts.length === 0) {
    return <div className="p-4 text-gray-500">Nessun contatto disponibile</div>;
  }

  return (
    <div className="w-72 border-r border-gray-200 overflow-y-auto">
      <ul>
        {contacts.map(contact => (
          <li key={contact.id}>
            <button
              onClick={() => onSelect(contact)}
              className="w-full text-left p-3 hover:bg-gray-100 transition flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {contact.name[0]}
              </div>
              <span>{contact.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;



















