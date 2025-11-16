// src/components/HomeSection.jsx
import React, { useState } from "react";
import clsx from "clsx";
import { Plus, Heart, MessageCircle, Share2 } from "lucide-react";

const HomeSection = ({ posts, artTags, filterTag, setFilterTag, user, uploadFile }) => {
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostArtTags, setNewPostArtTags] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  const handleAddTag = (tag) => {
    if (!newPostArtTags.includes(tag)) setNewPostArtTags([...newPostArtTags, tag]);
  };
  const handleRemoveTag = (tag) => setNewPostArtTags(newPostArtTags.filter(t => t !== tag));

  const handlePostAdded = async () => {
    if (!newPostTitle.trim() && !newPostDescription.trim() && !previewFile) return;
    let image_url = null;
    if (previewFile) image_url = await uploadFile(previewFile.file, "posts");

    // Inserimento post su Supabase
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
      setNewPostTitle("");
      setNewPostDescription("");
      setNewPostArtTags([]);
      setPreviewFile(null);
      setShowAddPost(false);
    }
  };

  const handleLike = async (postId) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const { data, error } = await supabase.from("posts").update({ likes: post.likes + 1 }).eq("id", postId);
    if (!error) {
      // Aggiorna UI
      posts = posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl p-4">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40 max-h-[80vh] overflow-y-auto relative">
          <button onClick={() => setShowAddPost(true)} className="flex items-center gap-3 w-full p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white"><Plus /></div>
            <span className="text-gray-600 font-semibold">Cosa stai pensando?</span>
          </button>

          {/* Filtri Art Tags */}
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

          {/* Lista post */}
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
  );
};

export default HomeSection;

