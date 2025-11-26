import React, { useState, useEffect, useRef } from "react";

const ChatWidget = ({ user, uploadFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [preview, setPreview] = useState(null);
  const [typing, setTyping] = useState(false);

  const [contacts] = useState([
    { id: "1", username: "Alice", avatar_url: "https://i.pravatar.cc/150?img=32", online: true },
    { id: "2", username: "Bob", avatar_url: "https://i.pravatar.cc/150?img=12", online: false },
  ]);

  const mockMessages = {
    "1": [{ id: "m1", sender_id: "1", content: "Ciao!", created_at: new Date() }],
    "2": [{ id: "m2", sender_id: "2", content: "Come va?", created_at: new Date() }],
  };

  const [messages, setMessages] = useState([]);
  const endRef = useRef(null);

  useEffect(() => {
    if (active) {
      setMessages(mockMessages[active.id] || []);
    }
  }, [active]);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollTop = endRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content) => {
    if (!content && !preview) return;

    let fileUrl = null;
    if (preview) fileUrl = await uploadFile(preview, "messages");

    const newMessage = {
      id: `local-${Date.now()}`,
      sender_id: user.id,
      receiver_id: active.id,
      content,
      file_url: fileUrl,
      created_at: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setPreview(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700"
      >
        💬
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
          {!active ? (
            <div>
              <h3 className="text-lg font-semibold mb-2">Messaggi</h3>
              {contacts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setActive(c)}
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100"
                >
                  <img src={c.avatar_url} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold">{c.username}</p>
                    <p className="text-xs text-gray-500">{c.online ? "Online" : "Offline"}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-96">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => setActive(null)}>←</button>
                <img src={active.avatar_url} className="w-10 h-10 rounded-full" />
                <p className="font-semibold">{active.username}</p>
              </div>

              <div ref={endRef} className="flex-1 overflow-y-auto mb-2 pr-2">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`p-2 mb-2 rounded-lg max-w-[80%] ${msg.sender_id === user.id ? "bg-blue-200 ml-auto" : "bg-gray-200"}`}
                  >
                    {msg.content && <p>{msg.content}</p>}
                    {msg.file_url && (
                      /\.(mp4|webm)$/i.test(msg.file_url)
                        ? <video src={msg.file_url} controls className="rounded-lg mt-2 max-h-40" />
                        : <img src={msg.file_url} className="rounded-lg mt-2 max-h-40" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scrivi..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                />
                <input type="file" onChange={(e) => setPreview(e.target.files[0])} className="hidden" id="fileMsg" />
                <label htmlFor="fileMsg" className="p-2 bg-gray-200 rounded-lg cursor-pointer">📎</label>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;

