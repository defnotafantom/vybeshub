// src/pages/ArtistProfilePage.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import AddPostForm from "@/components/AddPostForm";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import EditProfileModal from "@/components/EditProfileModal";

const ArtistProfilePage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [profile, setProfile] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const fetchProfile = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (error) return console.error(error);
    setProfile(data);
  };

  const fetchPosts = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("artist_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPosts();
  }, [user]);

  const images = posts.filter(p => p.image_url).map(p => ({ src: p.image_url }));

  const handleProfileUpdated = async () => {
    await fetchProfile();
  };

  if (!profile) return <p>Caricamento profilo...</p>;

  return (
    <div className="p-6 flex-1 overflow-auto">
      {/* Header profilo */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={profile.avatar_url || "https://i.imgur.com/placeholder.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h1 className="text-3xl font-bold">{profile.username || "Artista"}</h1>
          <p className="text-gray-600">{profile.art_type}</p>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
        <button
          className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-xl"
          onClick={() => setEditOpen(true)}
        >
          Modifica Profilo
        </button>
      </div>

      {/* Form aggiunta post (solo se artista loggato) */}
      <AddPostForm onPostAdded={(newPost) => setPosts(prev => [newPost, ...prev])} />

      {/* Griglia post */}
      {loading && <p>Caricamento post...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && posts.length === 0 && <p>Nessun post disponibile.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-white p-4 rounded shadow-md flex flex-col">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-2 cursor-pointer"
                onClick={() => {
                  setLightboxIndex(images.findIndex(img => img.src === post.image_url));
                  setLightboxOpen(true);
                }}
              />
            )}
            <h2 className="font-semibold text-lg">{post.title}</h2>
            <p className="text-gray-700 mt-1">{post.description}</p>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox open={lightboxOpen} index={lightboxIndex} close={() => setLightboxOpen(false)} slides={images} />

      {/* Modal modifica profilo */}
      {editOpen && (
        <EditProfileModal
          user={profile}
          onClose={() => setEditOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default ArtistProfilePage;


















