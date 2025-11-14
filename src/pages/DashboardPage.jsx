import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import WaveAnimation from "@/components/WaveAnimation";
import MapViewItalia from "@/components/MapViewItalia";

const DashboardPage = () => {
  const { logout } = useAuth();
  const [section, setSection] = useState("Home");
  const [mapOpen, setMapOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);

  const messages = {
    Luce: [
      { id: 1, text: "Ciao!", time: "10:30", read: true },
      { id: 2, text: "Hai visto la performance?", time: "10:32", read: false },
    ],
    Marco: [
      { id: 1, text: "Bozzetti pronti?", time: "09:45", read: true }
    ],
  };

  const unreadCount = Object.values(messages).reduce(
    (acc, chats) => acc + chats.filter(m => !m.read).length,
    0
  );

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-sky-50/50 via-white to-blue-50/50 overflow-hidden">
      {/* Onda sullo sfondo */}
      <div className="absolute inset-0 -z-10"><WaveAnimation /></div>

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-24 bg-white/30 backdrop-blur-md shadow-xl flex flex-col justify-between items-center z-30 rounded-tr-2xl rounded-br-2xl">
        <div className="mt-4 w-full flex justify-center">
          <img
            src="https://i.imgur.com/1E9TVpw_d.webp?maxwidth=760&fidelity=grand"
            alt="Logo"
            className="w-auto max-h-20 object-contain"
          />
        </div>
        <div className="flex flex-col flex-1 justify-center gap-4">
          {["Home", "Mappa", "Opportunità", "Community"].map((item) => (
            <button
              key={item}
              className={`w-20 h-14 rounded-xl ${
                section === item ? "bg-blue-500 text-white" : "bg-white/40"
              }`}
              onClick={() => {
                setSection(item);
                setMapOpen(item === "Mappa");
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <button onClick={logout} className="w-20 h-14 mb-4 bg-red-500 text-white rounded-xl">
          Logout
        </button>
      </div>

      {/* Contenuto principale */}
      <div className="ml-24 p-4 flex flex-col gap-6">
        {section === "Home" && <p>Benvenuto nella Home</p>}
        {section === "Opportunità" && <p>Opportunità disponibili</p>}
        {section === "Community" && <p>Community</p>}
      </div>

      {/* Pulsante Inbox */}
      <button
        className="fixed bottom-4 right-4 w-20 h-14 bg-blue-500 text-white rounded-xl"
        onClick={() => setInboxOpen(!inboxOpen)}
      >
        Inbox {unreadCount > 0 && `(${unreadCount})`}
      </button>

      {/* Overlay Mappa */}
      <AnimatePresence>
        {mapOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-40 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-11/12 sm:w-3/4 h-[600px] bg-white rounded-2xl shadow-xl overflow-hidden"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <MapViewItalia />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inbox */}
      <AnimatePresence>
        {inboxOpen && (
          <motion.div
            className="fixed bottom-16 right-4 w-80 h-96 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex justify-between bg-blue-500 text-white px-4 py-2">
              <span>Inbox</span>
              <button onClick={() => setInboxOpen(false)}>X</button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {Object.keys(messages).map((name) => (
                <div
                  key={name}
                  className="p-2 mb-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => setCurrentChat(name)}
                >
                  {name} ({messages[name].filter((m) => !m.read).length})
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;




