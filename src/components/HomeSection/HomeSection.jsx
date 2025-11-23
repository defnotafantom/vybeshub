import React, { useState, useEffect, useMemo } from "react";
import clsx from "clsx";
import { Plus, LayoutGrid, LayoutList, Layout, MessageSquare } from "lucide-react";
import TagFilters from "@/components/HomeSection/TagFilters";
import FloatingChat from "@/components/HomeSection/Chat/FloatingChat";


/* Import layout feed */
import FeedCover from "@/components/HomeSection/ViewModeSelector/FeedCover";
import FeedSocial from "@/components/HomeSection/ViewModeSelector/FeedSocial";
import FeedMasonry from "@/components/HomeSection/ViewModeSelector/FeedMasonry";
import FeedThreads from "@/components/HomeSection/ViewModeSelector/FeedThreads";

/* -------------------- INBOX -------------------- */
const InboxComponent = ({ user }) => {
  const [messages] = useState([
    { id: 1, text: "Ciao! Come va?", sender: "Alice" },
    { id: 2, text: "Sei pronto per la live?", sender: "Bob" },
  ]);

  return (
    <aside className="w-72 bg-white shadow-xl rounded-2xl p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Inbox</h3>
        <span className="text-xs text-gray-500">Utente: {user?.id}</span>
      </div>

      {messages.length === 0 ? (
        <div className="text-sm text-gray-500">Nessun messaggio</div>
      ) : (
        messages.map(m => (
          <div key={m.id} className="p-2 bg-gray-100 rounded-lg">
            <div className="text-sm"><strong>{m.sender}</strong></div>
            <div className="text-sm text-gray-700">{m.text}</div>
          </div>
        ))
      )}
    </aside>
  );
};

/* -------------------- HOMESECTION -------------------- */
const HomeSection = ({ user = { id: "me", user_metadata: {} } }) => {
  const artTags = useMemo(
    () => [
      { id: 1, name: "Arte" },
      { id: 2, name: "Illustrazione" },
      { id: 3, name: "Fotografia" },
      { id: 4, name: "Musica" },
      { id: 5, name: "Design" },
      { id: 6, name: "Animazione" },
    ],
    []
  );

  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("homeViewMode") || "cover"
  );
  const [selectedTags, setSelectedTags] = useState(() => {
    const saved = localStorage.getItem("homeSelectedTags");
    return saved ? JSON.parse(saved) : [];
  });

  /* Load iniziale post fake */
  useEffect(() => {
    setPosts([
      { id: 1, title: "Paesaggio urbano", author: "Luca", imageUrl: "https://picsum.photos/600/400?1", description: "Vista mozzafiato della città al tramonto.", tags: ["Fotografia", "Arte"], created_at: new Date().toISOString(), likes: 10, comments: 2, isLiked: false, isSaved: false },
      { id: 2, title: "Illustrazione fantasy", author: "Marta", imageUrl: "https://picsum.photos/600/400?2", description: "Concept art per un mondo immaginario.", tags: ["Illustrazione", "Animazione", "Design"], created_at: new Date().toISOString(), likes: 5, comments: 1, isLiked: false, isSaved: false },
      { id: 3, title: "Cover acustica", author: "Giulia", imageUrl: "", description: "Una cover registrata in acustico.", tags: ["Musica"], created_at: new Date().toISOString(), likes: 20, comments: 4, isLiked: false, isSaved: false },
      { id: 4, title: "Poster minimal", author: "Daniele", imageUrl: "https://picsum.photos/600/400?3", description: "Poster sperimentale in stile minimal.", tags: ["Design", "Arte"], created_at: new Date().toISOString(), likes: 2, comments: 0, isLiked: false, isSaved: false },
    ]);
  }, []);

  /* Persistenza UI */
  useEffect(() => localStorage.setItem("homeViewMode", viewMode), [viewMode]);
  useEffect(() => localStorage.setItem("homeSelectedTags", JSON.stringify(selectedTags)), [selectedTags]);

  /* Filtraggio tag */
  const toggleTag = tagName => setSelectedTags(prev =>
    prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
  );
  const clearAllTags = () => setSelectedTags([]);

  const filteredPosts = useMemo(() => {
    if (!selectedTags.length) return posts;
    return posts.filter(p => p.tags?.some(tag => selectedTags.includes(tag)));
  }, [posts, selectedTags]);

  /* Handlers PostAction */
  const handleLike = postId => setPosts(prev =>
    prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)
  );
  const handleSave = postId => setPosts(prev =>
    prev.map(p => p.id === postId ? { ...p, isSaved: !p.isSaved } : p)
  );
  const handleShare = postId => {
    const post = posts.find(p => p.id === postId);
    if (post) navigator.clipboard.writeText(window.location.href + `#post-${post.id}`);
    alert("Link copiato negli appunti!");
  };
  const handleReport = postId => alert(`Segnalato post ${postId}`);
  const handleCopyLink = postId => {
    const post = posts.find(p => p.id === postId);
    if (post) navigator.clipboard.writeText(window.location.href + `#post-${post.id}`);
    alert("Link copiato negli appunti!");
  };

  /* -------------------- SWITCH LAYOUT -------------------- */
  const renderPosts = () => {
    const commonProps = { posts: filteredPosts, onTagClick: toggleTag, onLike: handleLike, onSave: handleSave, onShare: handleShare, onReport: handleReport, onCopyLink: handleCopyLink };
    switch (viewMode) {
      case "cover": return <FeedCover {...commonProps} />;
      case "social": return <FeedSocial {...commonProps} />;
      case "masonry": return <FeedMasonry {...commonProps} />;
      case "threads": return <FeedThreads {...commonProps} />;
      default: return null;
    }
  };

  /* -------------------- RENDER -------------------- */
  return (
    <div className="flex justify-center w-full relative py-6 gap-6">
      <div className="w-full max-w-4xl p-4">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40 max-h-[80vh] relative">

          {/* Top controls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 w-full p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white"><Plus /></div>
              <button onClick={() => alert("Popup creazione post")} className="text-gray-600 font-semibold text-left flex-1">Crea nuovo post</button>
            </div>

            <div className="flex items-center gap-2">
              {["cover","social","masonry","threads"].map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)} className={clsx("p-2 rounded-2xl transition-colors", viewMode === mode ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700")}>
                  {{ cover:<LayoutGrid size={18}/>, social:<LayoutList size={18}/>, masonry:<Layout size={18}/>, threads:<MessageSquare size={18}/> }[mode]}
                </button>
              ))}
            </div>

            <TagFilters artTags={artTags} selectedTags={selectedTags} toggleTag={toggleTag} clearAll={clearAllTags} />
          </div>

          {/* FEED */}
          {renderPosts()}
        </div>
      </div>

      {/* Inbox */}
      <FloatingChat user={user} />
    </div>
  );
};

export default HomeSection;









