import React, { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import WaveAnimation from "@/components/WaveAnimation";
import EditProfileModal from "@/components/EditProfileModal";
import AddPostForm from "@/components/AddPostForm";
import { supabase } from "@/lib/supabaseClient";
import {
  Home as HomeIcon,
  Map as MapIcon,
  Lightbulb as LightbulbIcon,
  Users as UsersIcon,
  User as UserIcon,
  Plus,
  MessageCircle
} from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const MapViewItalia = lazy(() => import("@/components/MapViewItalia"));
const ArtistProfilePage = lazy(() => import("@/pages/ArtistProfilePage"));

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState("Home");
  const [activeModal, setActiveModal] = useState(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);

  const [posts, setPosts] = useState([]);

  // Inbox
  const [inboxOpen, setInboxOpen] = useState(false);
  const [messages, setMessages] = useState({
    "Mario Rossi": [{ text: "Ciao!", read: false }],
    "Luca Bianchi": [{ text: "Hey!", read: true }]
  });
  const [currentChat, setCurrentChat] = useState(null);

  if (!user) return <Navigate to="/homepage" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/homepage", { replace: true });
  };

  const menuItems = [
    { label: "Home", icon: <HomeIcon />, section: "Home" },
    { label: "Mappa", icon: <MapIcon />, section: "Mappa" },
    { label: "Opportunità", icon: <LightbulbIcon />, section: "Opportunità" },
    { label: "Community", icon: <UsersIcon />, section: "Community" },
    { label: "Profilo", icon: <UserIcon />, section: "Profilo", onClick: () => setSection("Profilo") },
  ];

  // --- Feed posts realtime v2 ---
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("Errore caricamento post:", error.message);
      else setPosts(data);
    };
    fetchPosts();

    const channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => setPosts((current) => [payload.new, ...current])
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) =>
          setPosts((current) =>
            current.map((p) => (p.id === payload.new.id ? payload.new : p))
          )
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        (payload) =>
          setPosts((current) =>
            current.filter((p) => p.id !== payload.old.id)
          )
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sectionComponents = {
    Home: (
      <div className="relative flex justify-center w-full h-full">
        <div className="w-full max-w-2xl p-4 space-y-4">
          {posts.length === 0 && (
            <p className="text-center text-gray-500">Nessun post ancora</p>
          )}
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={post.avatar_url || "https://i.pravatar.cc/40"}
                  alt={post.author_name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {post.author_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 font-bold">{post.title}</p>
              <p className="text-gray-700">{post.description}</p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="post"
                  className="mt-2 rounded-md max-h-80 w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>

        {/* Pulsanti flottanti */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
          <button
            className="bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg flex justify-center items-center hover:bg-blue-600 transition-colors"
            onClick={() => setShowAddPost(true)}
            title="Nuovo post"
          >
            <Plus />
          </button>
          <button
            className="bg-green-500 text-white w-14 h-14 rounded-full shadow-lg flex justify-center items-center hover:bg-green-600 transition-colors"
            title="Chat"
            onClick={() => setInboxOpen(!inboxOpen)}
          >
            <MessageCircle />
          </button>
        </div>

        {/* Modal nuovo post */}
        {showAddPost && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg">
              <AddPostForm
                onPostAdded={() => setShowAddPost(false)}
                onPostUpdated={() => {}}
              />
              <button
                className="mt-2 px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={() => setShowAddPost(false)}
              >
                Chiudi
              </button>
            </div>
          </div>
        )}

        {/* Inbox flottante */}
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
    ),
    Mappa: (
      <Suspense fallback={<p>Caricamento mappa...</p>}>
        <MapViewItalia />
      </Suspense>
    ),
    Opportunità: <p>Opportunità disponibili</p>,
    Community: <p>Community</p>,
    Profilo: (
      <Suspense fallback={<p>Caricamento profilo...</p>}>
        <ArtistProfilePage openEditModal={() => setActiveModal("editProfile")} />
      </Suspense>
    ),
  };

  // Sidebar intatta
  const SidebarContent = (
    <div
      className={clsx(
        "h-full bg-gray-200/40 backdrop-blur-xl shadow-2xl flex flex-col justify-between rounded-tr-2xl rounded-br-2xl border-r border-blue-200/30 transition-all duration-300",
        sidebarHover ? "px-4 w-64" : "px-2 w-18"
      )}
      onMouseEnter={() => setSidebarHover(true)}
      onMouseLeave={() => setSidebarHover(false)}
    >
      <div className="mt-4 w-full flex justify-center">
        <img
          src="https://i.imgur.com/1E9TVpw_d.webp?maxwidth=760&fidelity=grand"
          alt="Logo"
          className="w-auto max-h-20 object-contain opacity-90 animate-wavePulse"
        />
      </div>

      <div className="flex flex-col flex-1 justify-center gap-4 mt-6 w-full">
        {menuItems.map((item) => (
          <button
            key={item.label}
            aria-label={item.label}
            className={clsx(
              "flex items-center h-14 rounded-2xl transition-all duration-300 w-full",
              section === item.section
                ? "bg-gray-100 text-black shadow-md"
                : "bg-gray-200/40 text-gray-700 hover:bg-gray-300/50"
            )}
            onClick={() => {
              if (item.onClick) return item.onClick();
              setSection(item.section);
              setMobileSidebarOpen(false);
            }}
          >
            <div
              className={clsx(
                "flex-shrink-0 h-full flex justify-center items-center transition-all duration-300",
                sidebarHover ? "w-12" : "w-full"
              )}
            >
              {item.icon}
            </div>
            <div
              className={clsx(
                "overflow-hidden transition-all duration-300 font-bold flex items-center h-full whitespace-nowrap",
                sidebarHover ? "opacity-100 ml-3" : "opacity-0 ml-0 w-0"
              )}
            >
              {item.label}
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="w-full h-12 mb-4 bg-red-500/80 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all duration-300"
      >
        Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-hidden flex">
      <div className="absolute inset-0 -z-10 opacity-60">
        <WaveAnimation />
      </div>

      {/* Sidebar desktop */}
      <div className="hidden md:flex fixed top-0 left-0 h-full z-30">
        {SidebarContent}
      </div>

      {/* Sidebar mobile drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        >
          <div className="absolute left-0 top-0 h-full z-50">{SidebarContent}</div>
        </div>
      )}

      {/* Toggle button mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileSidebarOpen(true)}
      >
        Menu
      </button>

      {/* Contenuto principale */}
      <div
        className={clsx(
          "flex-1 flex flex-col gap-6 overflow-auto p-4 transition-all duration-300",
          "ml-18 md:ml-64"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {sectionComponents[section]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modale edit profile */}
      {activeModal === "editProfile" && user && (
        <EditProfileModal
          user={user}
          onClose={() => setActiveModal(null)}
          onProfileUpdated={() => console.log("Profilo aggiornato")}
        />
      )}
    </div>
  );
};

export default DashboardLayout;




