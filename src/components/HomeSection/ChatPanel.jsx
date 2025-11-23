// src/components/HomeSection/ChatPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Inbox, X, Paperclip } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function ChatPanel({ user, isOpen, toggleChat, uploadFile }) {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [previewFiles, setPreviewFiles] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const chatEndRef = useRef(null);

  // --- Caricamento contatti --- 
  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await supabase.from("users").select("id, username, avatar_url, online");
      setContacts(data || []);
      const initialUnread = {};
      data.forEach(c => { initialUnread[c.id] = 0; });
      setUnreadCounts(initialUnread);
    };
    fetchContacts();
  }, []);

  // --- Caricamento messaggi e listener Supabase ---
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: true });
      setMessages(data || []);
    };
    fetchMessages();

    const messageChannel = supabase.channel("public:messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        const msg = payload.new;
        setMessages(prev => [...prev, msg]);

        // Incrementa badge se messaggio per me e contatto non è attivo
        if (msg.receiver_id === user.id && (!activeChat || activeChat.id !== msg.sender_id)) {
          setUnreadCounts(prev => ({ ...prev, [msg.sender_id]: (prev[msg.sender_id] || 0) + 1 }));
        }
      })
      .subscribe();

    return () => supabase.removeChannel(messageChannel);
  }, [user.id, activeChat]);

  // Scroll automatico
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTo({ top: chatEndRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, activeChat]);

  const handleSelectContact = (contact) => {
    setActiveChat(contact);
    setUnreadCounts(prev => ({ ...prev, [contact.id]: 0 }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(f => ({ file: f, url: URL.createObjectURL(f) }));
      setPreviewFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removePreviewFile = (index) => setPreviewFiles(prev => prev.filter((_, i) => i !== index));

  const handleSendMessage = async () => {
    if (!newMessage.trim() && previewFiles.length === 0) return;

    const uploadedFiles = [];
    for (const f of previewFiles) {
      const url = await uploadFile(f.file, "messages");
      uploadedFiles.push({ file_url: url });
    }

    const newMsg = {
      sender_id: user.id,
      receiver_id: activeChat.id,
      content: newMessage,
      files: uploadedFiles,
      created_at: new Date()
    };

    await supabase.from("messages").insert([newMsg]);
    setNewMessage("");
    setPreviewFiles([]);
  };

  const handleBack = () => setActiveChat(null);

  return (
    <>
      <button onClick={toggleChat} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
        <Inbox size={24}/>
        {Object.values(unreadCounts).reduce((a, b) => a + b, 0) > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-300">
          {!activeChat ? (
            <div className="flex-1 overflow-y-auto">
              <div className="text-center font-bold p-2 border-b border-gray-300 flex justify-between items-center">
                <span>Seleziona un contatto</span>
                <button onClick={toggleChat}><X /></button>
              </div>
              {contacts.map(c => (
                <button key={c.id} className="flex items-center gap-2 p-2 w-full hover:bg-gray-200 transition-colors relative"
                  onClick={() => handleSelectContact(c)}>
                  <img src={c.avatar_url || "https://i.pravatar.cc/40"} alt={c.username} className="w-10 h-10 rounded-full"/>
                  <span className="font-semibold">{c.username}</span>
                  {unreadCounts[c.id] > 0 && (
                    <span className="absolute right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCounts[c.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <>
              {/* chat thread e input messaggi identico a prima */}
            </>
          )}
        </div>
      )}
    </>
  );
}



