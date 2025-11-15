// src/pages/DashboardLayout.jsx
import React, { useState, useEffect, Suspense, lazy } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import WaveAnimation from "@/components/WaveAnimation";
import EditProfileModal from "@/components/EditProfileModal";
import { supabase } from "@/lib/supabaseClient";
import { Home as HomeIcon, Map as MapIcon, Lightbulb as LightbulbIcon, Users as UsersIcon, User as UserIcon, Plus, MessageSquare as InboxIcon, Heart, MessageCircle, Share2 } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const MapViewItalia = lazy(() => import("@/components/MapViewItalia"));

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [section, setSection] = useState("Home");
  const [sidebarHover, setSidebarHover] = useState(false);
  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false);
  const [artTags, setArtTags] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostArtTags, setNewPostArtTags] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

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
    { label: "Inbox", icon: <InboxIcon />, section: "Inbox" },
    { label: "Profilo", icon: <UserIcon />, section: "Profilo" },
  ];

  // --- Load posts e realtime ---
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
      if (!error) setPosts(data || []);
    };
    fetchPosts();
    const channel = supabase.channel("posts")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, (payload) =>
        setPosts(current => [payload.new, ...current])
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  // --- Carica Art-Tag ---
  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("art_tag").select("id, name").order("name", { ascending: true });
      if (!error) setArtTags(data || []);
    };
    fetchTags();
  }, []);

  // --- Carica profilo utente ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!error) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  // --- Gestione tag post ---
  const handleAddTag = (tag) => {
    if (!newPostArtTags.includes(tag)) setNewPostArtTags([...newPostArtTags, tag]);
  };
  const handleRemoveTag = (tag) => setNewPostArtTags(newPostArtTags.filter(t => t !== tag));

  // --- Upload file ---
  const uploadFile = async (file, folder) => {
    const ext = file.name.split(".").pop();
    const fileName = `${user.id}_${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from(folder).upload(fileName, file);
    if (error) { console.error("Upload error:", error); return null; }
    const { data: signedUrlData } = await supabase.storage.from(folder).createSignedUrl(fileName, 3600);
    return signedUrlData?.signedUrl || null;
  };

  // --- Creazione Post ---
  const handlePostAdded = async () => {
    if (!newPostTitle.trim() && !newPostDescription.trim() && !previewFile) return;
    let image_url = null;
    if (previewFile) image_url = await uploadFile(previewFile.file, "posts");
    const { data, error } = await supabase.from("posts").insert([{
      author_id: user.id,
      author_name: user?.user_metadata?.full_name || "Username",
      avatar_url: user?.user_metadata?.avatar_url,
      title: newPostTitle,
      description: newPostDescription,
      art_tag: newPostArtTags.join(", "),
      image_url,
      created_at: new Date(),
      likes: 0,
      comments: []
    }]);
    if (!error) {
      setPosts(prev => [data[0], ...prev]);
      setNewPostTitle("");
      setNewPostDescription("");
      setNewPostArtTags([]);
      setPreviewFile(null);
      setShowAddPost(false);
    }
  };

  // --- Like post ---
  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const { data, error } = await supabase.from("posts").update({ likes: post.likes + 1 }).eq("id", postId);
    if (!error) setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  // --- Sidebar ---
  const SidebarContent = (
    <div className={clsx(
      "h-full bg-gray-200/40 backdrop-blur-xl shadow-2xl flex flex-col justify-between rounded-tr-2xl rounded-br-2xl border-r border-blue-200/30 transition-all duration-300",
      sidebarHover ? "px-4 w-64" : "px-2 w-18"
    )} onMouseEnter={() => setSidebarHover(true)} onMouseLeave={() => setSidebarHover(false)}>
      <div className="mt-4 w-full flex justify-center">
        <img src="https://i.imgur.com/1E9TVpw_d.webp" alt="Logo" className="w-auto max-h-20 object-contain opacity-90 animate-wavePulse"/>
      </div>
      <div className="flex flex-col flex-1 justify-center gap-4 mt-6 w-full">
        {menuItems.map(item => (
          <button key={item.label} aria-label={item.label} className={clsx(
            "flex items-center h-14 rounded-2xl transition-all duration-300 w-full shadow-md",
            section === item.section ? "bg-gray-100 text-black" : "bg-gray-200/40 text-gray-700 hover:bg-gray-300/50"
          )} onClick={() => setSection(item.section)}>
            <div className={clsx("flex-shrink-0 h-full flex justify-center items-center transition-all duration-300", sidebarHover ? "w-12" : "w-full")}>
              {item.icon}
            </div>
            <div className={clsx("overflow-hidden transition-all duration-300 font-bold flex items-center h-full whitespace-nowrap", sidebarHover ? "opacity-100 ml-3" : "opacity-0 ml-0 w-0")}>
              {item.label}
            </div>
          </button>
        ))}
      </div>
      <button onClick={handleLogout} className="w-full h-12 mb-4 rounded-2xl shadow-md font-bold transition-all duration-300 bg-red-500 hover:bg-red-600 text-white">Logout</button>
    </div>
  );

  // --- InboxSection (chat + fallback mock) ---
  const InboxSection = () => {
    const [contacts, setContacts] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [previewFile, setPreviewFile] = useState(null);

    // Mock rapido
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
      const { data } = await supabase.from("messages").insert([{
        content: newMessage,
        file_url,
        sender_id: user.id,
        receiver_id: activeChat.id,
        created_at: new Date()
      }]);
      if (data && data[0]) setMessages(prev => [...prev, data[0]]);
      else if (previewFile || newMessage) setMessages(prev => [...prev, {
        id: `temp_${Date.now()}`,
        sender_id: user.id,
        receiver_id: activeChat.id,
        content: newMessage,
        file_url,
        created_at: new Date()
      }]);
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

  // --- Sezioni Dashboard ---
  const sectionComponents = {
    Home: (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-4xl p-4">
          <div className="bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40 max-h-[80vh] overflow-y-auto relative">
            <button onClick={() => setShowAddPost(true)} className="flex items-center gap-3 w-full p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white"><Plus /></div>
              <span className="text-gray-600 font-semibold">Cosa stai pensando?</span>
            </button>
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

            {posts.filter(post => !filterTag || post.art_tag?.split(", ").includes(filterTag)).map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-shadow duration-300 border border-gray-200 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <img src={post.avatar_url || "https://i.pravatar.cc/40"} alt={post.author_name} className="w-10 h-10 rounded-full"/>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{post.title}</span>
                    <p className="text-sm text-gray-500">{post.author_name} · {new Date(post.created_at).toLocaleDateString()}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {post.art_tag?.split(", ").map((tag, idx) => <span key={idx} className="px-2 py-1 bg-gray-200/80 rounded-xl text-xs">{tag}</span>)}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mt-1">{post.description}</p>
                {post.image_url && (post.image_url.match(/\.(mp4|webm|mov)$/i)
                  ? <video src={post.image_url} controls className="mt-3 rounded-lg w-full max-h-80 object-cover"/>
                  : <img src={post.image_url} alt="post" className="mt-3 rounded-lg w-full max-h-80 object-cover"/>
                )}
                <div className="flex gap-4 mt-3">
                  <button onClick={() => handleLike(post.id)} className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"><MessageCircle /> Comment</button>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors"><Share2 /> Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    Mappa: <Suspense fallback={<p>Caricamento mappa...</p>}><MapViewItalia /></Suspense>,
    Opportunità: <p>Opportunità disponibili</p>,
    Community: <p>Community</p>,
    Profilo: (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-4xl p-4">
          {profile && (
            <div className="bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40">
              {/* Header profilo */}
              <div className="flex items-center gap-4">
                <img src={profile.avatar_url || "https://i.imgur.com/placeholder.png"} alt="Avatar" className="w-24 h-24 rounded-full border object-cover"/>
                <div>
                  <h1 className="text-3xl font-bold">{profile.username || "Artista"}</h1>
                  <p className="text-gray-600">{profile.art_type}</p>
                  <p className="text-gray-700">{profile.bio}</p>
                </div>
                <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-xl" onClick={() => setEditOpen(true)}>Modifica Profilo</button>
              </div>
              {/* Qui puoi aggiungere altri elementi della profilazione */}
            </div>
          )}
        </div>
      </div>
    ),
    Inbox: <InboxSection />
  };

  return (
    <div className="min-h-screen w-full relative bg-gradient-to-br from-gray-100 via-white to-gray-200 overflow-hidden flex">
      <div className="absolute inset-0 -z-10 opacity-60"><WaveAnimation /></div>
      <div className="hidden md:flex fixed top-0 left-0 h-full z-30">{SidebarContent}</div>
      <div className="flex-1 flex flex-col gap-6 overflow-auto p-4 transition-all duration-300 ml-64">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={section} initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.3}}>
            {sectionComponents[section]}
          </motion.div>
        </AnimatePresence>
      </div>
      {editOpen && profile && <EditProfileModal user={profile} onClose={() => setEditOpen(false)} uploadFile={uploadFile} onProfileUpdated={() => console.log("Profilo aggiornato")} />}
    </div>
  );
};

export default DashboardLayout;



