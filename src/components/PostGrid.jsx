import React, { useState } from "react";

const PostGrid = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  // Fallback placeholder se posts è vuoto o undefined
  const displayPosts =
    posts && posts.length > 0
      ? posts
      : Array.from({ length: 8 }).map((_, i) => ({
          media_url: "https://via.placeholder.com/300",
          media_type: "image",
          caption: `Post placeholder ${i + 1}`,
        }));

  return (
    <div className="w-full flex justify-center mt-6">
      <div className="relative w-full max-w-5xl p-4 bg-gray-50/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-blue-200/40">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {displayPosts.map((post, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-2xl shadow-lg bg-gray-100 border border-blue-200/40 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {post.media_type === "video" ? (
                <video
                  src={post.media_url}
                  muted
                  loop
                  playsInline
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
                />
              ) : (
                <img
                  src={post.media_url || post.image_url}
                  alt={post.caption || `post-${index}`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
                />
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-sm line-clamp-2">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedPost(null)}
        >
          <div className="bg-white rounded-xl overflow-hidden max-w-lg w-full">
            {selectedPost.media_type === "video" ? (
              <video
                src={selectedPost.media_url}
                controls
                className="w-full object-cover"
              />
            ) : (
              <img
                src={selectedPost.media_url || selectedPost.image_url}
                alt={selectedPost.caption}
                className="w-full object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-gray-800">{selectedPost.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostGrid;
