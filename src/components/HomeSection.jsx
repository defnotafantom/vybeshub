// src/components/HomeSection.jsx
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { Plus, Inbox, X, Paperclip } from "lucide-react";
import NewPostPopup from "@/components/NewPostPopup";
import { supabase } from "@/lib/supabaseClient";

const HomeSection = ({ posts, artTags, filterTag, setFilterTag, user, uploadFile }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const chatEndRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [newMessageNotif, setNewMessageNotif] = useState(false);

  // Blocca scroll del body quando popup aperto
  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isPopupOpen]);

  // Contatti e messaggi di prova
  const mockContacts = [
    { id: "1", username: "Alice", avatar_url: "https://i.pravatar.cc/150?img=32", online: true },
    { id: "2", username: "Bob", avatar_url: "https://i.pravatar.cc/150?img=12", online: false },
    { id: "3", username: "Charlie", avatar_url: "https://i.pravatar.cc/150?img=22", online: true },
  ];

  const mockMessages = {
    "1": [ { id: "m1", sender_id: "1", receiver_id: user.id, content: "Ciao! Come va?", created_at: new Date() } ],
    "2": [ { id: "m2", sender_id: "2", receiver_id: user.id, content: "Guarda questa immagine", file_url: "https://picsum.photos/200", created_at: new Date() } ],
    "3": [ { id: "m3", sender_id: "3", receiver_id: user.id, content: "Video test", file_url: "https://www.w3schools.com/html/mov_bbb.mp4", created_at: new Date() } ]
  };

  // Carica contatti e unread
  useEffect(() => {
    setContacts(mockContacts);
    const initialUnread = {};
    mockContacts.forEach(c => {
      initialUnread[c.id] = mockMessages[c.id] ? mockMessages[c.id].length : 0;
    });
    setUnreadCounts(initialUnread);
  }, []);

  const handleSelectContact = (contact) => {
    setActiveChat({ ...contact, typing: false });
    setMessages(mockMessages[contact.id] || []);
    setUnreadCounts(prev => ({ ...prev, [contact.id]: 0 }));
    setNewMessageNotif(false);
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
    setNewMessage("");
    setPreviewFile(null);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTo({ top: chatEndRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
    if (isChatOpen) setActiveChat(null);
  };

  const handleBack = () => setActiveChat(null);

  return (
    <div className="flex justify-center w-full relative">
      <div className="w-full max-w-4xl p-4">
        <div className={clsx(
          "bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40 max-h-[80vh] relative",
          isPopupOpen ? "overflow-y-hidden" : "overflow-y-auto"
        )}>
          {/* Pulsante "Crea nuovo post" */}
          <button onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-3 w-full p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white"><Plus /></div>
            <span className="text-gray-600 font-semibold">Crea nuovo post</span>
          </button>

          {/* Popup nuovo post */}
          <NewPostPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            uploadFile={uploadFile}
            artTags={artTags}
            onPostSubmit={async (postData) => {
              const { data, error } = await supabase.from("posts").insert([{
                author_id: user.id,
                author_name: user?.user_metadata?.full_name || "Username",
                avatar_url: user?.user_metadata?.avatar_url,
                title: postData.title,
                description: postData.description,
                art_tag: postData.tags.join(", "),
                image_url: postData.fileUrl,
                created_at: new Date(),
                likes: 0,
                comments: []
              }]);
              if (!error) posts.unshift(data[0]);
            }}
          />

          {/* Filtri Art Tags */}
          <div className="flex flex-wrap gap-2 mt-4 mb-2">
            {artTags.map(tag => (
              <button key={tag.id} className={clsx(
                "px-3 py-1 rounded-2xl shadow-md text-sm font-semibold transition-colors",
                filterTag === tag.name ? "bg-blue-500 text-white" : "bg-gray-200/80 text-gray-800 hover:bg-gray-300"
              )} onClick={() => setFilterTag(filterTag === tag.name ? "" : tag.name)}>
                {tag.name}
              </button>
            ))}
          </div>

          {/* Lista post */}
          {posts.filter(post => !filterTag || post.art_tag?.split(", ").includes(filterTag))
            .map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow duration-300 border border-gray-200 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src={post.avatar_url || "https://i.pravatar.cc/40"} alt={post.author_name} className="w-10 h-10 rounded-full"/>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{post.title}</span>
                    <p className="text-sm text-gray-500">{post.author_name} · {new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-gray-700 mt-1">{post.description}</p>
                {post.image_url && (post.image_url.match(/\.(mp4|webm|mov)$/i)
                  ? <video src={post.image_url} controls className="mt-3 rounded-lg w-full max-h-80 object-cover"/>
                  : <img src={post.image_url} alt="post" className="mt-3 rounded-lg w-full max-h-80 object-cover"/>
                )}
              </div>
          ))}
        </div>
      </div>

      {/* Pulsante Inbox */}
      <button onClick={toggleChat} className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors" title="Inbox">
        {isChatOpen ? <X size={24}/> : <Inbox size={24}/>}
      </button>

      {/* Mini-chat */}
      {isChatOpen && (
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
                  <div className="relative">
                    <img src={c.avatar_url || "https://i.pravatar.cc/40"} alt={c.username} className="w-10 h-10 rounded-full"/>
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${c.online ? "bg-green-500" : "bg-gray-400"}`}></span>
                  </div>
                  <span className="font-semibold">{c.username}</span>
                  {unreadCounts[c.id] > 0 && <span className="absolute right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{unreadCounts[c.id]}</span>}
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="bg-blue-500 text-white p-3 font-bold flex justify-between items-center rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <button onClick={handleBack} className="mr-2">←</button>
                  <img src={activeChat.avatar_url} alt={activeChat.username} className="w-10 h-10 rounded-full"/>
                  <span>{activeChat.username}</span>
                  <span className={`w-2 h-2 rounded-full ${activeChat.online ? "bg-green-500" : "bg-gray-400"}`}></span>
                </div>
                <button onClick={toggleChat}><X /></button>
              </div>

              <div className="flex-1 p-2 overflow-y-auto space-y-2" ref={chatEndRef}>
                {messages.length === 0 && <p className="text-gray-500 text-sm text-center">Inizia a scrivere un messaggio...</p>}
                {messages.map(msg => (
                  <div key={msg.id} className={clsx(
                    "max-w-[70%] break-words p-2 rounded-2xl transition-all duration-300",
                    msg.sender_id === user.id ? "bg-blue-100 self-end text-right" : "bg-gray-200 self-start text-left"
                  )}>
                    {msg.file_url && (
                      msg.file_url.match(/\.(mp4|webm|mov)$/i)
                        ? <video src={msg.file_url} controls className="rounded-lg max-w-full h-auto"/>
                        : <img src={msg.file_url} alt="msg" className="rounded-lg max-w-full h-auto object-contain"/>
                    )}
                    {msg.content && <p className="text-sm mt-1">{msg.content}</p>}
                    <span className="text-xs text-gray-500 mt-1 block">{new Date(msg.created_at).toLocaleTimeString()}</span>
                  </div>
                ))}
                {activeChat?.typing && <p className="text-sm text-gray-400 italic text-left">Sta scrivendo...</p>}
                {newMessageNotif && <p className="text-xs text-gray-500 text-center italic">Nuovi messaggi!</p>}
              </div>

              <div className="p-2 border-t border-gray-300 flex flex-wrap items-center gap-2">
                <button onClick={() => document.getElementById('fileInput')?.click()} 
                  className="flex-shrink-0 bg-gray-200 p-2 rounded-xl hover:bg-gray-300 transition-colors flex items-center justify-center">
                  <Paperclip />
                </button>
                <input id="fileInput" type="file" accept="image/*,video/*" className="hidden"
                  onChange={e => { if(e.target.files && e.target.files[0]) setPreviewFile({ file: e.target.files[0], url: URL.createObjectURL(e.target.files[0]) }); }}
                />
                <input type="text" placeholder="Scrivi un messaggio..." value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  className="flex-1 min-w-[100px] p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button onClick={sendMessage} className="flex-shrink-0 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
                  Invia
                </button>
              </div>

              {previewFile && <div className="mt-2 flex justify-center">
                {previewFile.file.type.startsWith("image/")
                  ? <img src={previewFile.url} alt="preview" className="w-32 h-32 object-contain rounded-xl border border-gray-200 shadow-sm"/>
                  : <video src={previewFile.url} controls className="w-32 h-32 object-contain rounded-xl border border-gray-200 shadow-sm"/>
                }
              </div>}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeSection;




