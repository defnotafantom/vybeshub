import React, { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon,
  Map as MapIcon,
  Lightbulb as LightbulbIcon,
  Users as UsersIcon,
  User as UserIcon,
  Inbox as InboxIcon,
  Info as InfoIcon,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import WaveAnimation from "@/components/WaveAnimation";
import HomeSection from "@/components/HomeSection/HomeSection";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import ProfileSection from "@/components/ProfileSection";
import InfoSection from "@/components/InfoSection";

// Lazy load components
const MapViewItalia = lazy(() => import("@/components/MapViewItalia"));
const InboxSection = lazy(() => import("@/components/InboxSection"));

/* ---------- small in-file custom hooks ---------- */
function usePosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (!error && mounted) setPosts(data || []);
    };
    fetchPosts();

    const channel = supabase.channel("posts").on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      (payload) => setPosts(current => [payload.new, ...current])
    ).subscribe();

    return () => {
      mounted = false;
      try { supabase.removeChannel(channel); } 
      catch { channel?.unsubscribe?.(); }
    };
  }, []);
  return { posts, setPosts };
}

function useArtTags() {
  const [artTags, setArtTags] = useState([]);
  useEffect(() => {
    let mounted = true;
    const fetchTags = async () => {
      const { data, error } = await supabase.from("art_tag").select("id, name").order("name");
      if (!error && mounted) setArtTags(data || []);
    };
    fetchTags();
    return () => { mounted = false; };
  }, []);
  return { artTags, setArtTags };
}

function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    const fetchProfile = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
      if (!error && mounted) setProfile(data);
    };
    fetchProfile();
    return () => { mounted = false; };
  }, [userId]);
  return { profile, setProfile };
}

/* --------------------------------- DashboardLayout --------------------------------- */
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState("Home");
  const [sidebarHover, setSidebarHover] = useState(false);
  const [filterTag, setFilterTag] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { posts } = usePosts();
  const { artTags } = useArtTags();
  const { profile } = useProfile(user?.id);

  if (!user) return <Navigate to="/homepage" replace />;

  const handleLogout = async () => {
    await logout();
    navigate("/homepage", { replace: true });
  };

  const uploadFile = async (file, folder) => {
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(folder).upload(fileName, file);
      if (uploadError) return null;
      const { data: signedData } = await supabase.storage.from(folder).createSignedUrl(fileName, 3600);
      return signedData?.signedUrl || null;
    } catch { return null; }
  };

  /* ---------- Sidebar inline ---------- */
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
      <div
        className={clsx(
          "h-full bg-gray-200/40 backdrop-blur-xl shadow-2xl flex flex-col justify-between rounded-tr-2xl rounded-br-2xl border-r border-blue-200/30 transition-all duration-300",
          hover ? "px-4 w-64" : "px-16"
        )}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="mt-4 w-full flex justify-center">
          <img
            src="https://i.imgur.com/1E9TVpw_d.webp"
            alt="Logo"
            className="w-auto max-h-20 object-contain opacity-90 animate-wavePulse"
          />
        </div>
        <div className="flex flex-col flex-1 justify-center gap-4 mt-6 w-full">
          {menuItems.map(item => (
            <button
              key={item.label}
              className={clsx(
                "flex items-center h-14 rounded-2xl transition-all duration-300 w-full shadow-md",
                section === item.section ? "bg-gray-100 text-black" : "bg-gray-200/40 text-gray-700 hover:bg-gray-300/50"
              )}
              onClick={() => setSection(item.section)}
            >
              <div className={clsx("flex-shrink-0 h-full flex justify-center items-center transition-all duration-300", hover ? "w-12" : "w-full")}>
                {item.icon}
              </div>
              <div className={clsx("overflow-hidden transition-all duration-300 font-bold flex items-center h-full whitespace-nowrap", hover ? "opacity-100 ml-3" : "opacity-0 ml-0 w-0")}>
                {item.label}
              </div>
            </button>
          ))}
        </div>
        <button onClick={onLogout} className="w-full h-12 mb-4 rounded-2xl shadow-md font-bold transition-all duration-300 bg-blue-600 hover:bg-blue-500 text-white">
          Logout
        </button>
      </div>
    );
  };

  /* ---------- Sections ---------- */
  const titles = {
    Home: "Home",
    Mappa: "Mappa",
    Opportunità: "Opportunità",
    Community: "Community",
    Profilo: "Il mio profilo",
    Inbox: "Inbox",
    Info: "Informazioni",
  };

  const sectionComponents = {
    Home: <HomeSection posts={posts} artTags={artTags} filterTag={filterTag} setFilterTag={setFilterTag} user={user} uploadFile={uploadFile} setIsPopupOpen={setIsPopupOpen} />,
    Mappa: (
      <Suspense fallback={<div className="p-6 text-center">Caricamento mappa…</div>}>
        <MapViewItalia markers={[{ coordinates: [12.4964, 41.9028], label: "Roma" }, { coordinates: [9.1900, 45.4642], label: "Milano" }, { coordinates: [11.2558, 43.7696], label: "Firenze" }]} />
      </Suspense>
    ),
    Opportunità: <OpportunitiesSection user={user} />,
    Community: <div className="flex justify-center mt-10">Community Section</div>,
    Profilo: <ProfileSection profile={profile} uploadFile={uploadFile} currentUser={user} isMyProfile={profile?.id === user?.id} setEditOpen={() => setSection("EditProfile")} />,
    Inbox: (
      <Suspense fallback={<div className="p-6 text-center">Caricamento chat…</div>}>
        <InboxSection user={user} uploadFile={uploadFile} />
      </Suspense>
    ),
    Info: <InfoSection />,
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-hidden flex">
      <div className="absolute inset-0 -z-10 opacity-60"><WaveAnimation /></div>

      <div className="hidden md:flex fixed top-0 left-0 h-full z-30">
        <Sidebar section={section} setSection={setSection} hover={sidebarHover} setHover={setSidebarHover} onLogout={handleLogout} />
      </div>

      <div className={`flex-1 flex flex-col gap-2 p-4 transition-all duration-300 ml-64 ${isPopupOpen ? "overflow-hidden" : "overflow-auto"}`}>
        <div className="w-full flex justify-center mt-2 text-lg font-bold text-2xl text-black-900 tracking-tight">
          {titles[section]}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={section} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            {sectionComponents[section]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;




