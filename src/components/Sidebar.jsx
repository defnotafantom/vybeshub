// src/components/Sidebar.jsx
import React from "react";
import clsx from "clsx";
import { Home as HomeIcon, Map as MapIcon, Lightbulb as LightbulbIcon, Users as UsersIcon, User as UserIcon, MessageSquare as InboxIcon, Info as InfoIcon } from "lucide-react";

const Sidebar = ({ section, setSection, hover, setHover, onLogout }) => {
  const menuItems = [
    { label: "Home", icon: <HomeIcon />, section: "Home" },
    { label: "Mappa", icon: <MapIcon />, section: "Mappa" },
    { label: "Opportunità", icon: <LightbulbIcon />, section: "Opportunità" },
    { label: "Community", icon: <UsersIcon />, section: "Community" },
    { label: "Inbox", icon: <InboxIcon />, section: "Inbox" },
    { label: "Profilo", icon: <UserIcon />, section: "Profilo" },
    { label: "Info", icon: <InfoIcon />, section: "Info" },
  ];

  return (
    <div className={clsx("h-full bg-gray-200/40 backdrop-blur-xl shadow-2xl flex flex-col justify-between rounded-tr-2xl rounded-br-2xl border-r border-blue-200/30 transition-all duration-300", hover ? "px-4 w-64" : "px-2 w-18")}
         onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="mt-4 w-full flex justify-center">
        <img src="https://i.imgur.com/1E9TVpw_d.webp" alt="Logo" className="w-auto max-h-20 object-contain opacity-90 animate-wavePulse"/>
      </div>
      <div className="flex flex-col flex-1 justify-center gap-4 mt-6 w-full">
        {menuItems.map(item => (
          <button key={item.label} aria-label={item.label} className={clsx(
            "flex items-center h-14 rounded-2xl transition-all duration-300 w-full shadow-md",
            section === item.section ? "bg-gray-100 text-black" : "bg-gray-200/40 text-gray-700 hover:bg-gray-300/50"
          )} onClick={() => setSection(item.section)}>
            <div className={clsx("flex-shrink-0 h-full flex justify-center items-center transition-all duration-300", hover ? "w-12" : "w-full")}>
              {item.icon}
            </div>
            <div className={clsx("overflow-hidden transition-all duration-300 font-bold flex items-center h-full whitespace-nowrap", hover ? "opacity-100 ml-3" : "opacity-0 ml-0 w-0")}>
              {item.label}
            </div>
          </button>
        ))}
      </div>
      <button onClick={onLogout} className="w-full h-12 mb-4 rounded-2xl shadow-md font-bold transition-all duration-300 bg-red-500 hover:bg-red-600 text-white">Logout</button>
    </div>
  );
};

export default Sidebar;
