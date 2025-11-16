// src/components/InboxSection.jsx
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { supabase } from "@/lib/supabaseClient";

const InboxSection = ({ user, uploadFile }) => {
  const [contacts, setContacts] = useState([]);
  const [lastMessages, setLastMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [previewFile, setPreviewFile] = useState(null);

  const mockContacts = [
    { id: "1", username: "Alice", avatar_url: "https://i.pravatar.cc/150?img=32" },
    { id: "2", username: "Bob", avatar_url: "https://i.pravatar.cc/150?img=12" },
    { id: "3", username: "Charlie", avatar_url: "https://i.pravatar.cc/150?img=22" },
  ];

  const mockMessages = {
    "1": [{ id: "m1", sender_id: "1", receiver_id: user.id, content: "Ciao! Come va?", created_at: new Date() }],
    "2": [{ id: "m3", sender_id: "2", receiver_id: user.id, content: "Guarda questa immagine", file_url: "https://picsum.photos/200", created_at: new Date() }],
    "3": [{ id: "m4", sender_id: "3", receiver_id: user.id, content: "Video test", file_url: "https://www.w3schools.com/html/mov_bbb.mp4", created_at: new Date() }]
  };

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase.from("profiles").select("*").neq("id", user.id);
      if (!error && data.length > 0) {
        setContacts(data);
        const last = {};
        data.forEach(c => { last[c.id] = null; });
        setLastMessages(last);
      } else {
        setContacts(mockContacts);
        const last = {};
        Object.keys(mockMessages).forEach(cid => { last[cid] = mockMessages[cid][mockMessages[cid].length - 1]; });
        setLastMessages(last);
      }
    };
    fetchContacts();
  }, []);

  const fetchMessages = async (contactId) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    if (!error && data.length > 0) setMessages(data);
    else if (mockMessages[contactId]) setMessages(mockMessages[contactId]);
    else setMessages([]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !previewFile) return;
    let file_url = null;
    if (previewFile) file_url = await uploadFile(previewFile.file, "messages");
    const newMsg = {
      id: `temp_${Date.now()}`,
      sender_id: user.id,
      receiver_id: activeChat.id,
      content: newMessage,
      file_url,
      created_at: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
    setNewMessage(""); setPreviewFile(null);
  };

  useEffect(() => {
    const channel = supabase.channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        const msg = payload.new;
        if (activeChat && (msg.sender_id === activeChat.id || msg.receiver_id === activeChat.id)) setMessages(prev => [...prev, msg]);
        const contactId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        setLastMessages(prev => ({ ...prev, [contactId]: msg }));
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [activeChat]);

  return (
    <div className="flex w-full h-[80vh] gap-4">
      <div className="w-72 flex flex-col border-r border-gray-300 p-2 space-y-2 overflow-y-auto">
        {contacts.map(contact => (
          <button key={contact.id} onClick={() => { setActiveChat(contact); fetchMessages(contact.id); }}
            className={clsx("flex items-center gap-3 p-2 rounded-xl hover:bg-gray-200 transition-colors", activeChat?.id === contact.id ? "bg-gray-300" : "bg-gray-100/50")}>
            <img src={contact.avatar_url || "https://i.pravatar.cc/40"} alt={contact.username} className="w-12 h-12 rounded-full"/>
            <div className="flex flex-col flex-1 text-left">
              <span className="font-bold">{contact.username}</span>
              {lastMessages[contact.id] && <span className="text-sm text-gray-600 truncate">
                {lastMessages[contact.id].file_url
                  ? lastMessages[contact.id].file_url.match(/\.(mp4|webm|mov)$/i) ? "📹 Video" : "🖼️ Immagine"
                  : lastMessages[contact.id].content}
              </span>}
            </div>
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-blue-200/40">
        {activeChat ? <>
          <div className="flex items-center gap-3 mb-4 border-b border-gray-300 pb-2">
            <img src={activeChat.avatar_url} alt={activeChat.username} className="w-12 h-12 rounded-full"/>
            <span className="font-bold text-lg">{activeChat.username}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map(msg => (
              <div key={msg.id} className={clsx("max-w-xs p-3 rounded-2xl break-words", msg.sender_id === user.id ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-gray-800 mr-auto")}>
                {msg.file_url ? msg.file_url.match(/\.(mp4|webm|mov)$/i)
                  ? <video src={msg.file_url} controls className="rounded-lg max-w-full"/>
                  : <img src={msg.file_url} alt="msg" className="rounded-lg max-w-full"/>
                  : msg.content
                }
                {msg.content && <p className="mt-1">{msg.content}</p>}
                <span className="text-xs text-gray-500 mt-1 block">{new Date(msg.created_at).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <input type="text" placeholder="Scrivi un messaggio..." value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"/>
            <input type="file" accept="image/*,video/*"
              onChange={e => { if(e.target.files && e.target.files[0]) setPreviewFile({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) }); }} />
            <button onClick={sendMessage} className="px-4 py-2 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors">Invia</button>
          </div>
          {previewFile && <div className="mt-2">{previewFile.file.type.startsWith("image/")
            ? <img src={previewFile.url} alt="preview" className="w-32 h-32 object-contain rounded-2xl border border-gray-200 shadow-sm"/>
            : <video src={previewFile.url} controls className="w-32 h-32 object-contain rounded-2xl border border-gray-200 shadow-sm"/>
          }</div>}
        </> : <p className="text-gray-500 text-center mt-10">Seleziona un contatto per iniziare la chat</p>}
      </div>
    </div>
  );
};

export default InboxSection;
