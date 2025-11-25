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

const feedWidth = {
  cover: "max-w-6xl",
  social: "max-w-3xl",
  masonry: "max-w-7xl",
  threads: "max-w-2xl",
};

const HomeSection = ({ user = { id: "me", user_metadata: {} } }) => {
  const artTags = useMemo(() => [
    { id: 1, name: "Arte" },
    { id: 2, name: "Illustrazione" },
    { id: 3, name: "Fotografia" },
    { id: 4, name: "Musica" },
    { id: 5, name: "Design" },
    { id: 6, name: "Animazione" },
  ], []);

  const [posts, setPosts] = useState([]);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("homeViewMode") || "cover");
  const [selectedTags, setSelectedTags] = useState(() => {
    const saved = localStorage.getItem("homeSelectedTags");
    return saved ? JSON.parse(saved) : [];
  });
  const [transitioning, setTransitioning] = useState(false);

  /* Load iniziale post fake */
  useEffect(() => {
    setPosts([
      /* COVER POSTS */
      { id: 1, title: "Paesaggio urbano", author: "Luca", imageUrl: "https://picsum.photos/600/800?1", description: "Vista mozzafiato della città al tramonto.", tags: ["Fotografia", "Arte"], type: "image", likes: 10, comments: 2, isLiked: false, isSaved: false },
      { id: 2, title: "Illustrazione fantasy", author: "Marta", imageUrl: "https://picsum.photos/600/400?2", description: "Concept art per un mondo immaginario.", tags: ["Illustrazione", "Animazione"], type: "image", likes: 5, comments: 1, isLiked: false, isSaved: false },

      /* SOCIAL POSTS */
      { id: 3, title: "Cover acustica", author: "Giulia", imageUrl: "", description: "Una cover registrata in acustico.", tags: ["Musica"], type: "text", likes: 20, comments: 4, isLiked: false, isSaved: false },
      { id: 4, title: "GIF divertente", author: "Andrea", imageUrl: "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif", description: "Momento comico catturato in GIF.", tags: ["Animazione"], type: "gif", likes: 12, comments: 3, isLiked: false, isSaved: false },

      /* MASONRY POSTS */
      { id: 5, title: "Poster minimal", author: "Daniele", imageUrl: "https://picsum.photos/600/900?3", description: "Poster sperimentale in stile minimal.", tags: ["Design", "Arte"], type: "image", likes: 2, comments: 0, isLiked: false, isSaved: false },
      { id: 6, title: "Animazione astratta", author: "Silvia", imageUrl: "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif", description: "Piccola animazione astratta.", tags: ["Animazione"], type: "gif", likes: 8, comments: 1, isLiked: false, isSaved: false },
      { id: 7, title: "Video tutorial", author: "Marco", imageUrl: "https://www.w3schools.com/html/mov_bbb.mp4", description: "Mini video su design grafico.", tags: ["Design"], type: "video", likes: 15, comments: 5, isLiked: false, isSaved: false },

      /* THREADS POSTS */
      { id: 8, title: "Discussione musica", author: "Elena", imageUrl: "", description: "Condividi i tuoi brani preferiti.", tags: ["Musica"], type: "text", likes: 3, comments: 7, isLiked: false, isSaved: false },
      { id: 9, title: "Fotografia urbana", author: "Lorenzo", imageUrl: "", description: "Parliamo di tecniche fotografiche in città.", tags: ["Fotografia"], type: "text", likes: 6, comments: 2, isLiked: false, isSaved: false },
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

  /* Render feed coerente */
  const renderPosts = () => {
    const commonProps = {
      posts: filteredPosts,
      onTagClick: toggleTag,
      onLike: handleLike,
      onSave: handleSave,
      onShare: handleShare,
      onReport: handleReport,
      onCopyLink: handleCopyLink
    };
    switch (viewMode) {
      case "cover": return <FeedCover {...commonProps} />;
      case "social": return <FeedSocial {...commonProps} />;
      case "masonry": return <FeedMasonry {...commonProps} />;
      case "threads": return <FeedThreads {...commonProps} />;
      default: return null;
    }
  };

  const handleViewChange = mode => {
    if (mode === viewMode) return;
    setTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setTransitioning(false);
    }, 200);
  };

  return (
    <div className="flex justify-center w-full relative py-6 gap-6">
      <div className={clsx("w-full p-4 transition-all duration-300 mx-auto", feedWidth[viewMode])}>
        <div className={clsx(
          "bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40 relative",
          "transition-all duration-300"
        )}>

          {/* Top controls */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 w-full p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100 transition-colors border border-gray-200">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white"><Plus /></div>
              <button onClick={() => alert("Popup creazione post")} className="text-gray-600 font-semibold text-left flex-1">
                Crea nuovo post
              </button>
            </div>

            <div className="flex items-center gap-2">
              {["cover","social","masonry","threads"].map(mode => (
                <button key={mode} onClick={() => handleViewChange(mode)} className={clsx(
                  "p-2 rounded-2xl transition-colors",
                  viewMode === mode ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                )}>
                  {{
                    cover:<LayoutGrid size={18}/>,
                    social:<LayoutList size={18}/>,
                    masonry:<Layout size={18}/>,
                    threads:<MessageSquare size={18}/>
                  }[mode]}
                </button>
              ))}
            </div>

            <TagFilters artTags={artTags} selectedTags={selectedTags} toggleTag={toggleTag} clearAll={clearAllTags} />
          </div>

          {/* FEED – transizione fluida */}
          <div className={clsx(
            "transition-all duration-300",
            transitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
          )}>
            {renderPosts()}
          </div>
        </div>
      </div>

      {/* Inbox */}
      <FloatingChat user={user} />
    </div>
  );
};

export default HomeSection;

