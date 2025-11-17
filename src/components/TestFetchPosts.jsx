import { useEffect, useState } from "react";

export default function TestFetchPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/posts?select=*`;

      const res = await fetch(url, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        console.error("Errore fetch:", res.statusText);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Test Posts</h2>
      {posts.length === 0 && <p>Nessun post trovato.</p>}
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="p-2 border rounded">
            {post.media_url ? (
              post.media_type === "video" ? (
                <video src={post.media_url} controls className="w-full" />
              ) : (
                <img src={post.media_url} alt={post.caption} className="w-full" />
              )
            ) : null}
            <p>{post.caption}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
