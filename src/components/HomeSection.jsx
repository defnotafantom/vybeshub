import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { Plus, LayoutGrid, LayoutList, Layout, MessageSquare, Inbox as InboxIcon } from "lucide-react";
import NewPostPopup from "@/components/NewPostPopup";
import PostList from "@/components/PostList";
import ChatWidget from "@/components/ChatWidget";
import { supabase } from "@/lib/supabaseClient";

const HomeSection = ({ artTags = [], filterTag, setFilterTag, user, uploadFile }) => {
  const [posts, setPosts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [viewMode, setViewMode] = useState("cover");
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isPopupOpen]);

  // --- Carica posts e subscribe realtime tramite channel (Supabase v2) ---
  useEffect(() => {
    let channel;
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setPosts(data || []);
    };

    fetchPosts();

    channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => setPosts(prev => [payload.new, ...prev])
      )
      .subscribe();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="flex justify-center w-full relative">
      <div className="w-full max-w-4xl p-4">
        <div className={clsx(
          "bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40 max-h-[80vh] relative",
          isPopupOpen ? "overflow-y-hidden" : "overflow-y-auto"
        )}>
          {/* Pulsante nuovo post */}
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-3 w-full p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white">
              <Plus />
            </div>
            <span className="text-gray-600 font-semibold">Crea nuovo post</span>
          </button>

          {/* Switch view modes */}
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setViewMode("cover")} className={clsx("p-2 rounded-2xl", viewMode === "cover" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700")}><LayoutGrid size={18}/></button>
            <button onClick={() => setViewMode("social")} className={clsx("p-2 rounded-2xl", viewMode === "social" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700")}><LayoutList size={18}/></button>
            <button onClick={() => setViewMode("masonry")} className={clsx("p-2 rounded-2xl", viewMode === "masonry" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700")}><Layout size={18}/></button>
            <button onClick={() => setViewMode("threads")} className={clsx("p-2 rounded-2xl", viewMode === "threads" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700")}><MessageSquare size={18}/></button>
          </div>

          {/* Popup nuovo post */}
          <NewPostPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            uploadFile={uploadFile}
            artTags={artTags}
            onPostSubmit={async (postData) => {
              const { data, error } = await supabase.from("posts").insert([{
                user_id: user.id,
                author_name: user?.user_metadata?.full_name || "Username",
                avatar_url: user?.user_metadata?.avatar_url || null,
                title: postData.title,
                caption: postData.description,
                art_tag: (postData.tags || []).join(", "),
                image_url: postData.fileUrl ? [postData.fileUrl] : [],
                created_at: new Date(),
                likes: 0,
                comments: []
              }]);
              if (!error && data) setPosts(prev => [data[0], ...prev]);
            }}
          />

          {/* Filtri tag */}
          <div className="flex flex-wrap gap-2 mt-4 mb-2">
            {artTags.map(tag => (
              <button
                key={tag.id}
                className={clsx(
                  "px-3 py-1 rounded-2xl shadow-md text-sm font-semibold transition-colors",
                  filterTag === tag.name ? "bg-blue-500 text-white" : "bg-gray-200/80 text-gray-800 hover:bg-gray-300"
                )}
                onClick={() => setFilterTag(filterTag === tag.name ? "" : tag.name)}
              >
                {tag.name}
              </button>
            ))}
          </div>

          {/* Lista dei post */}
          <PostList posts={posts} filterTag={filterTag} viewMode={viewMode} />
        </div>
      </div>

      {/* Pulsante Inbox (fixed bottom-right) */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors z-40"
        title="Inbox"
        aria-expanded={isChatOpen}
        aria-label="Apri chat"
      >
        <InboxIcon size={22} />
      </button>

      {/* Chat panel slide-in (docked a destra) */}
      <ChatWidget
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        user={user}
        uploadFile={uploadFile}
      />
    </div>
  );
};

export default HomeSection;
