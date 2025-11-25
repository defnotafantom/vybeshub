// src/components/Sidebar.jsx
import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  Home as HomeIcon,
  Map as MapIcon,
  Lightbulb as LightbulbIcon,
  Users as UsersIcon,
  User as UserIcon,
  Inbox as InboxIcon,
  Info as InfoIcon,
  LogOut as LogOutIcon,
} from "lucide-react";

const Sidebar = ({ section, setSection, hover, setHover, onLogout }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: <HomeIcon size={24} />, section: "Home" },
    { id: "map", label: "Mappa", icon: <MapIcon size={24} />, section: "Mappa" },
    { id: "opportunities", label: "Opportunità", icon: <LightbulbIcon size={24} />, section: "Opportunità" },
    { id: "community", label: "Community", icon: <UsersIcon size={24} />, section: "Community" },
    { id: "inbox", label: "Inbox", icon: <InboxIcon size={24} />, section: "Inbox" },
    { id: "profile", label: "Profilo", icon: <UserIcon size={24} />, section: "Profilo" },
    { id: "info", label: "Info", icon: <InfoIcon size={24} />, section: "Info" },
  ];

  const renderButton = (icon, label, onClick, isActive = false, bgColor = null) => (
    <motion.button
      key={label} // ✅ aggiunto key
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={clsx(
        "flex items-center h-14 rounded-2xl w-full shadow-md px-4 transition-all duration-300",
        bgColor
          ? bgColor
          : isActive
          ? "bg-gray-100 text-black"
          : "bg-gray-200/40 text-gray-700 hover:bg-gray-300/50"
      )}
    >
      <motion.div
        className="flex items-center w-full"
        initial={false}
        animate={{ justifyContent: hover ? "flex-start" : "center" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex-shrink-0 flex justify-center items-center w-12">{icon}</div>
        <motion.div
          animate={{
            opacity: hover ? 1 : 0,
            marginLeft: hover ? 14 : 0,
            width: hover ? "auto" : 0,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden font-bold flex items-center h-full whitespace-nowrap"
        >
          {label}
        </motion.div>
      </motion.div>
    </motion.button>
  );

  return (
    <motion.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      initial={{ width: 72 }}
      animate={{ width: hover ? 256 : 72 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="hidden md:flex fixed top-0 left-0 h-full bg-gray-200/40 backdrop-blur-xl shadow-2xl flex flex-col justify-between rounded-tr-2xl rounded-br-2xl border-r border-blue-200/30 overflow-hidden z-30"
    >
      {/* Logo */}
      <div className="flex flex-col items-center py-8">
        <img
          src="https://i.imgur.com/1E9TVpw_d.webp"
          alt="Logo"
          className="object-contain w-40 max-h-20 opacity-90"
        />
      </div>

      {/* Menu Buttons */}
      <div className="flex flex-col flex-1 justify-center gap-4 px-2">
        {menuItems.map(item =>
          renderButton(item.icon, item.label, () => setSection(item.section), section === item.section)
        )}
      </div>

      {/* Logout */}
      <div className="px-4 py-4 flex justify-center">
        {renderButton(
          <LogOutIcon size={24} />,
          "Logout",
          onLogout,
          false,
          "bg-blue-600 text-white hover:bg-blue-500"
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;














