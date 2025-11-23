// src/pages/TestSupabase.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const TestSupabase = () => {
  const [posts, setPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dati reali da Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // --- Posts ---
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) console.error("Errore fetch posts:", postsError);
      else setPosts(postsData);

      // --- Chats (messaggi) ---
      const { data: chatsData, error: chatsError } = await supabase
        .from("chats")
        .select("*")
        .order("created_at", { ascending: false });

      if (chatsError) console.error("Errore fetch chats:", chatsError);
      else setChats(chatsData);

      setLoading(false);
    };

    fetchData();
  }, []);

  // Fallback mock se non ci sono dati reali
  const mockPosts = [
    { id: 1, title: "Mock Post 1", caption: "Descrizione post 1", avatar_url: "", username: "Alice", art_tag: "illustrazione", image_url: ["https://picsum.photos/200/300"] },
    { id: 2, title: "Mock Post 2", caption: "Descrizione post 2", avatar_url: "", username: "Bob", art_tag: "fotografia", image_url: ["https://picsum.photos/300/200"] },
  ];

  const mockChats = [
    { id: 1, sender_id: "user1", receiver_id: "user2", content: "Ciao!", created_at: new Date() },
    { id: 2, sender_id: "user2", receiver_id: "user1", content: "Ciao a te!", created_at: new Date() },
  ];

  if (loading) return <div>Loading Supabase test...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Supabase</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Posts</h2>
        {(posts?.length ? posts : mockPosts).map(post => (
          <div key={post.id} className="p-2 border-b border-gray-300">
            <p><strong>{post.username}</strong> ({post.art_tag})</p>
            <p>{post.title}</p>
            {post.image_url?.length > 0 && (
              <img src={post.image_url[0]} alt={post.title} className="w-48 h-auto mt-1 rounded" />
            )}
            <p>{post.caption}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold">Chats / Messages</h2>
        {(chats?.length ? chats : mockChats).map(msg => (
          <div key={msg.id} className="p-2 border-b border-gray-300">
            <p><strong>{msg.sender_id}</strong> → <strong>{msg.receiver_id}</strong></p>
            <p>{msg.content}</p>
            <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default TestSupabase;
